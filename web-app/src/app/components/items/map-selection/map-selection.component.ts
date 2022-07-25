import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet-draw';
// import * as LeafletDraw from 'leaflet-draw'
import * as geolib from 'geolib';
import 'leaflet.pm';
import 'leaflet.pm/dist/leaflet.pm.css';
import { StateService } from 'src/app/services/state.service';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';
import { CategoryQuestionsService } from 'src/app/services/category-questions.service';
import { UserService } from 'src/app/services/user.service';
import { LeafletTileLayerDefinition } from '@asymmetrik/ngx-leaflet';
import { CompilerFacadeImpl } from '@angular/compiler/src/jit_compiler_facade';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { threadId } from 'worker_threads';
import { delay } from 'rxjs';
import { Router } from '@angular/router';
import bayern_borders from '../../../../assets/Regierungsbezirke/bayern_geoJSON.json';
import bezirke from '../../../../assets/Regierungsbezirke/bezirke.json';

@Component({
  selector: 'app-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss']
})
export class MapSelectionComponent implements AfterViewInit, OnInit {
  private map: any = null;
  private clicked_coordinates: Leaflet.LatLng = new Leaflet.LatLng(0, 0);
  private marker: any;
  public answerGiven: boolean = false;
  public triesLeft: number = 2;
  private correct_coordinates: Leaflet.LatLng = new Leaflet.LatLng(0, 0);
  private distance: number = 0;
  private threshold_correct = 20000;
  public infoMessage = "";
  public radius: number = 0;
  public drawCircle: Boolean = true;
  public circleDrawer: any;
  public areas = [];
  markerIconBlack = {
    icon: Leaflet.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      iconUrl: "../../../assets/images/marker_black.svg",
    })
  };
  markerIconRed = {
    icon: Leaflet.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "../../../assets/images/marker_red.svg",
    })
  };
  markerIconGreen = {
    icon: Leaflet.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "../../../assets/images/marker_green.svg",
    })
  };
  markerIconWhite = {
    icon: Leaflet.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "../../../assets/images/marker_white.svg",
    })
  };

  //added 
  public currentQuestion: any;
  private timeOnPage = 0;
  private interval: any;

  constructor(public currentQuiz: CurrentQuizService, public categoryService: CategoryQuestionsService, public service: StateService, public router: Router) {
    //added
    this.currentQuestion = this.currentQuiz.getCurrentQuestion();
    this.currentQuestion.givenAnswers = [];
  }

  ngOnInit(): void {
    //define which draw modus is on based on if the question was already correct answered before
    if (this.currentQuestion.answeredCorrect) {
      this.drawCircle = false;
    }

    //get correct coordinates 
    this.correct_coordinates.lat = this.currentQuestion.additionalInfos.correctAnswer[0];
    this.correct_coordinates.lng = this.currentQuestion.additionalInfos.correctAnswer[1];

    this.cleanData();

    //for time needed on page
    this.interval = setInterval(() => {
      this.timeOnPage++;
    }, 1000)

  }


  @Output() enableNextBtn = new EventEmitter<boolean>();
  onSetStateNextBtn(value: boolean) {
    this.enableNextBtn.emit(value);
  }

  ngOnDestroy() {
    //remove map
    let mapHTML = document.getElementById('map');
    mapHTML?.remove();
    clearInterval(this.interval)
    this.currentQuestion.timeNeeded = this.timeOnPage;
    this.currentQuestion.timeSummedUp += this.timeOnPage;
    this.currentQuestion.triesSummedUp += this.triesLeft;
    this.currentQuestion.alreadyAnsweredCount += 1;
    this.onSetStateNextBtn(false);
    delay(5000);
    this.currentQuiz.saveGivenAnswer(this.currentQuestion)
  }

  ngAfterViewInit(): void {
    //initialize map
    this.initMap();
    this.drawBorderBavaria();
    if (this.drawCircle) {
      //enable circle drawing
      // var options = {
      //   editable: true, // make CircleMarkers editable
      //   circleMarkerMin: 10, // min radius for CircleMarker
      //   circleMarkerMax: 10, // max radius for CircleMarker
      //   circleMin: 10, // min radius for Circle
      //   circleMax: 10, // max radius for Circle
      // }
      // this.map.pm.setGlobalOptions({
      //   minRadiusCircle: 500,
      //   maxRadiusCircle: 500,
      // });

      // this.map.on('pm:drawstart', (workingLayer: any) => {
      //   workingLayer.on('pm:centerplaced', (e: any) => {
      //     workingLayer.setRadius(10);
      //     this.map.pm.Draw.Circle._finishShape(e)
      //   });
      // });
      // this.map.pm.enableDraw('Circle', options);
      this.circleDrawer = new Leaflet.Draw.Circle(this.map);
      this.circleDrawer.enable();
      let that = this;
      this.map.on(Leaflet.Draw.Event.CREATED, function (e: any) {
        if (that.triesLeft < 2) {
          that.marker.remove();
        }
        var layer = e.layer;
        var theCenterPt = layer.getLatLng();
        that.clicked_coordinates.lat = theCenterPt.lat;
        that.clicked_coordinates.lng = theCenterPt.lng;
        that.marker = Leaflet.circle([that.clicked_coordinates.lat, that.clicked_coordinates.lng], 40000).addTo(that.map);
        that.answerGiven = true;
      });
      this.map.on("click", (e: any) => {
        if (!this.answerGiven) {
          this.circleDrawer.enable();
        }});

    } else {
      //enable pin on map -> listen to onclick no map and get coordinates
      this.map.on("click", (e: any) => {
        if (!this.answerGiven) {
          this.marker?.remove();
          this.clicked_coordinates.lat = e.latlng.lat;
          this.clicked_coordinates.lng = e.latlng.lng;
          console.log(this.getPercentageCorrect())
         // if (this.getPercentageCorrect() > 0.7) {
            this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconWhite).addTo(this.map); // add the marker onclick
          // } else {
          //   this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconBlack).addTo(this.map); // add the marker onclick
          // }
        }
      });
    }
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      // drawControl: true,
      center: [49, 11.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    //choose map based on previously correct answered map questions
    let correctAnswered: Number = this.getPercentageCorrect();
    if (correctAnswered < 0.3) {
      const map_wihtoutLabels = Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 7
      });
      map_wihtoutLabels.addTo(this.map);
    }
    else if (correctAnswered < 0.7) {
      const map_population = Leaflet.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 7
      });
      map_population.addTo(this.map);
    }
    else {
      var terrain = Leaflet.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 7,
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
      });
      terrain.addTo(this.map);
    }
  }


  private showSolution(): void {
    // add correct marker
    Leaflet.marker([this.correct_coordinates.lat, this.correct_coordinates.lng], this.markerIconBlack).addTo(this.map);

    //add line 
    var pointList = [this.correct_coordinates, this.clicked_coordinates];
    if (!this.drawCircle) {
      let polyline = Leaflet.polyline(pointList, { color: 'black' }).addTo(this.map);
      this.map.fitBounds(polyline.getBounds());
    }
    var Stadia_OSMBright = Leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
      maxZoom: 7,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    Stadia_OSMBright.addTo(this.map);
  }

  public validateAnswer(): void {
    this.answerGiven = true;
    let givenAnswer = []
    givenAnswer.push(this.clicked_coordinates.lat)
    givenAnswer.push(this.clicked_coordinates.lng)
    //answer correct
    if (this.answerCorrect()) {
      this.infoMessage = "Richtig, gut gemacht!";
      this.currentQuestion.answeredCorrect = true;
      this.onSetStateNextBtn(true);
      this.currentQuestion.givenAnswers[2 - this.triesLeft] = givenAnswer;
      if (this.drawCircle) {
        this.marker.setStyle({ color: 'green' });
      } else {
        this.marker.remove();
        this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconGreen).addTo(this.map); // add the marker onclick
      }
      this.showSolution();
    //answer not correct and still some tries left
    } else if (this.triesLeft > 0) { 
      this.currentQuestion.answeredCorrect = false;
      this.answerGiven = false;
      this.currentQuestion.givenAnswers[2 - this.triesLeft] = givenAnswer;
      this.greyOutArea();
      if (this.drawCircle) {
        this.marker.setStyle({ color: 'red' });
        this.circleDrawer.enable();
        this.infoMessage = "Leider nicht korrekt. Der gesuchte Punkt liegt nicht innerhalb des markierten Kreises. Versuche es erneut!";
      } else {
        this.marker.remove();
        this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconRed).addTo(this.map); // add the marker onclick
        this.infoMessage = "Leider nicht korrekt! Der Marker befindet sich noch " + (this.distance / 1000) + " km entfernt von dem gesuchten Punkt! Als Hilfe werden dir Bereiche ausgraut. Versuche es erneut!";
      }
      this.triesLeft = this.triesLeft - 1
    //answer not correct and no tries left
    } else {
      this.currentQuestion.answeredCorrect = false;
      this.currentQuestion.givenAnswers[2 - this.triesLeft] = givenAnswer;
      this.showSolution();
      if (this.drawCircle) {
        this.marker.setStyle({ color: 'red' });
        this.infoMessage = "Leider immer noch nicht korrekt. Der gesuchte Punkt liegt außerhalb des Kreises.";
      } else {
        this.marker.remove();
        this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconRed).addTo(this.map); // add the marker onclick
        this.infoMessage = "Nicht korrekt! Der Marker befindet sich immer noch " + (this.distance / 1000) + " km weg von dem gesuchten Punkt.";
      }
      this.answerGiven = true;
      this.onSetStateNextBtn(true);
    }
  }

  public answerCorrect(): boolean {
    if (this.drawCircle) {
      return geolib.isPointWithinRadius(
        this.correct_coordinates,
        this.clicked_coordinates,
        40000
      );
    } else {
      this.distance = geolib.getPreciseDistance(this.clicked_coordinates, this.correct_coordinates);
      return this.distance < this.threshold_correct;
    }
  }

  public getPercentageCorrect(): number {
    let answeredQuestions = this.categoryService.getCategoryQuestions(this.service.getCategory());
    // console.log(answeredQuestions);
    let datasetLength =  answeredQuestions.filter((element: any) => element.alreadyAnsweredCount > 0 && element.questionType == 2).length;
    let rightCounter = answeredQuestions.filter((element: any) => element.answeredCorrect === true && element.questionType == 2).length;
    if (datasetLength == 0) {
      return 0;
    }
    let percentageRight = rightCounter / datasetLength;
    return percentageRight;
  }

  public drawBorderBavaria() {
    let bavaria_borders_reversed: any = [];
    bayern_borders.forEach((coord: any, index) => {
      let newArray = [coord[1], coord[0]];
      bavaria_borders_reversed.push(newArray)
    })
    Leaflet.polyline(bavaria_borders_reversed, {color: 'grey'}).addTo(this.map);
  }

  public greyOutArea() {
    //get two random areas and show them on the map
    var area1 = this.areas.splice(Math.floor(Math.random()*this.areas.length), 1)[0];
    Leaflet.polygon(area1, {color: 'grey', fillOpacity: 1}).addTo(this.map);
    var area2 = this.areas.splice(Math.floor(Math.random()*this.areas.length), 1)[0];
    Leaflet.polygon(area2, {color: 'grey', fillOpacity: 1}).addTo(this.map);
  }

  public cleanData() {
    //convert to list of objects for geolib check
    let bezirke_dataReversed: any = [];
    bezirke.forEach((bezirk: any, index) => {
      let newArray: any = [];
      bezirk.forEach((coordinates: any) => {
        let newObject = {
          "latitude": coordinates[1],
          "longitude": coordinates[0]
        }
        newArray.push(newObject)

      })
      bezirk = newArray;
      bezirke_dataReversed.push(JSON.parse(JSON.stringify(bezirk)))
    });
    this.areas = bezirke_dataReversed;
    //filter area where searched point is located at
    this.areas = this.areas.filter((area:any) => !geolib.isPointInPolygon(this.correct_coordinates, area));
    //convert back to list of arrays
    let newAreas: any = [];
    this.areas.forEach((bezirk: any, index) => {
      let newArray: any = [];
      bezirk.forEach((coordinates: any) => {
        let newArray2 = [coordinates.latitude, coordinates.longitude]
        newArray.push(newArray2)
      })
      bezirk = newArray;
      newAreas.push(JSON.parse(JSON.stringify(bezirk)))
    });
    this.areas = newAreas;
  }
}


