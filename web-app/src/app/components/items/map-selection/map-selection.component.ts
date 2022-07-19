import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import * as geolib from 'geolib';
import { StateService } from 'src/app/services/state.service';
import { CurrentQuizService } from 'src/app/services/current-quiz.service';
import { CategoryQuestionsService } from 'src/app/services/category-questions.service';
import { UserService } from 'src/app/services/user.service';
import { LeafletTileLayerDefinition } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss']
})
export class MapSelectionComponent implements AfterViewInit, OnInit {
  private map: any;
  private cursor: any;
  private clicked_coordinates: Leaflet.LatLng = new Leaflet.LatLng(0, 0);
  private marker: any;
  public answerGiven: boolean = false;
  public triesLeft: number = 2;
  private correct_coordinates: Leaflet.LatLng = new Leaflet.LatLng(0, 0);
  private distance: number = 0;
  private threshold_correct = 20000;
  public infoMessage = "";
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

  //added 
  public currentQuestion: any;
  private timeOnPage = 0;
  private interval: any;

  constructor(public currentQuiz: CurrentQuizService, public categoryService: CategoryQuestionsService, public service: StateService) {
    //added
    this.currentQuestion = this.currentQuiz.getCurrentQuestion();
  }

  ngOnInit(): void {
    //user sees question for the first time;
    if (this.currentQuestion.alreadyAnsweredCount == 0) {

    }
    this.cursor = document.getElementById("cursor") as any;
    // document.body.addEventListener("mousemove", function (e) {
    //   that.cursor.style.left = e.clientX + "px",
    //     that.cursor.style.top = e.clientY + "px";
    // });

    //get correct coordinates 
    this.correct_coordinates.lat = this.currentQuestion.additionalInfos.correctAnswer[0];
    this.correct_coordinates.lng = this.currentQuestion.additionalInfos.correctAnswer[1];

    //for time needed on page
    this.interval = setInterval(() => {
      this.timeOnPage++;
    }, 1000)
  }

  ngOnDestroy() {
    clearInterval(this.interval)
    this.currentQuestion.timeNeeded = this.timeOnPage;
    this.currentQuestion.timeSummedUp += this.timeOnPage;
    this.currentQuestion.triesSummedUp += this.triesLeft;
    this.currentQuestion.alreadyAnsweredCount += 1;
    this.currentQuiz.saveGivenAnswer(this.currentQuestion);
    this.map.remove();
  }

  ngAfterViewInit(): void {
    this.initMap();

    //listen to onclick no map and get coordinates
    this.map.on("click", (e: any) => {
      if (this.triesLeft < 2) {
        this.marker.remove();
      }
      if (!this.answerGiven) {
        console.log(this.triesLeft);
        this.clicked_coordinates.lat = e.latlng.lat;
        this.clicked_coordinates.lng = e.latlng.lng;
        if (this.currentQuestion.alreadyAnsweredCount == 0) {
          this.marker = Leaflet.circle ([this.clicked_coordinates.lat, this.clicked_coordinates.lng],{radius: 40000}).addTo(this.map);
        } else {
          this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconBlack).addTo(this.map); // add the marker onclick
        }
      }
      this.answerGiven = true;
    });

  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [49, 11.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });
    //choose map based on previously correct answered map questions
    let correctAnswered: Number = this.getPercentageCorrect();
    if (correctAnswered < 0.3) {
      const labels = Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 7
      });

      labels.addTo(this.map);
    }
    else if (correctAnswered < 0.7) {
      const map_wihtoutLabels = Leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 7
      });
      map_wihtoutLabels.addTo(this.map);
    }
    else {
      const terrain = Leaflet.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 7,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });
      terrain.addTo(this.map);
    }
  }
  

  private showSolution(): void {
    // add correct marker
    Leaflet.marker([this.correct_coordinates.lat, this.correct_coordinates.lng], this.markerIconBlack).addTo(this.map);

    //add line 
    var pointList = [this.correct_coordinates, this.clicked_coordinates];
    let polyline = Leaflet.polyline(pointList, { color: 'black' }).addTo(this.map);
    this.map.fitBounds(polyline.getBounds())

    // zoom the map to the polyline
    this.map.fitBounds(polyline.getBounds());
  }

  public validateAnswer(): void {
    this.distance = geolib.getPreciseDistance(this.clicked_coordinates, this.correct_coordinates);
    let givenAnswer = []
    givenAnswer.push(this.clicked_coordinates.lat)
    givenAnswer.push(this.clicked_coordinates.lng)
    //answer correct
    if (this.distance < this.threshold_correct) {
      this.infoMessage = "Correct! You are less than 20 km away!"
      this.currentQuestion.answeredCorrect = true;
      this.currentQuestion.givenAnswers[2 - this.triesLeft] = givenAnswer;
      this.marker.remove();
      this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconGreen).addTo(this.map); // add the marker onclick
      this.showSolution();
      //answer not corrrect and still tries left
    } else if (this.triesLeft > 0) {
      this.answerGiven = false;
      this.currentQuestion.givenAnswers[2 - this.triesLeft] = givenAnswer;
      this.marker.remove();
      this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconRed).addTo(this.map); // add the marker onclick
      console.log(this.answerGiven);
      this.infoMessage = "Not correct! You are " + (this.distance / 1000) + " km away from the target! Try it again!";
      this.triesLeft = this.triesLeft - 1
    } else {
      this.currentQuestion.givenAnswers[2 - this.triesLeft] = givenAnswer;
      this.showSolution();
      this.marker.remove();
      this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconRed).addTo(this.map); // add the marker onclick
      this.infoMessage = "Not correct! You are still " + (this.distance / 1000) + " km away from the target! :(";
      this.answerGiven = true;
    }
  }

  public getPercentageCorrect(): number {
    let answeredQuestions = this.categoryService.getCategoryQuestions(this.service.getCategory());
    let datasetLength = answeredQuestions.length; 
    let rightCounter = answeredQuestions.filter((element:any) => element.answeredCorrect === true && element.questionType == 2).length;
    let percentageRight = rightCounter / datasetLength; 
    console.log(percentageRight);
    return percentageRight;
  }
}


