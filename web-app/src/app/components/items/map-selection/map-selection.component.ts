import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import * as geolib from 'geolib';

@Component({
  selector: 'app-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss']
})
export class MapSelectionComponent implements AfterViewInit, OnInit {
  private map: any;
  private cursor: any;
  private clicked_coordinates  : Leaflet.LatLng = new Leaflet.LatLng(0,0);
  private marker: any;
  public answerGiven: boolean = false;
  public tryLeft: boolean = true;
  private correct_coordinates : Leaflet.LatLng = new Leaflet.LatLng(0,0);
  private distance: number = 0;
  private threshold_corect = 20000;
  public infoMessage = "";
  public questionText = "Wo ist der Marienplatz?"
  markerIconBlack = {
    icon: Leaflet.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
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

  constructor() { }


  ngOnInit(): void {
    this.cursor = document.getElementById("cursor") as any;
    let that = this;
    document.body.addEventListener("mousemove", function (e) {
      that.cursor.style.left = e.clientX + "px",
        that.cursor.style.top = e.clientY + "px";
    });

    //specify correct coordinates here
    this.correct_coordinates.lat = 48.1372264;
    this.correct_coordinates.lng = 11.5755203;
  }




  ngAfterViewInit(): void {
    this.initMap();

    //listen to onclick no map and get coordinates
    this.map.on("click", (e: any) => {
      console.log(this.tryLeft);
      if(!this.tryLeft) {
        this.marker.remove();
      }
      if (!this.answerGiven) {
        this.clicked_coordinates.lat = e.latlng.lat;
        this.clicked_coordinates.lng = e.latlng.lng;
        this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconBlack).addTo(this.map); // add the marker onclick
        console.log(e.latlng); // get the coordinates
        this.verifyAnswer();
      }
      // this.cursor.
    });
  }

  private initMap(): void {
    this.map = Leaflet.map('map', {
      center: [49, 11.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    const tiles = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

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

  private verifyAnswer(): void {
    this.distance = geolib.getPreciseDistance(this.clicked_coordinates, this.correct_coordinates);
    console.log(this.distance);
    if (this.distance < this.threshold_corect) {
      this.infoMessage = "Correct! You are less than 20 km away!"
      this.marker.remove();
      this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconGreen).addTo(this.map); // add the marker onclick
      this.answerGiven = true;
      this.showSolution();
    } else if (this.tryLeft) {
      this.answerGiven = false;
      this.marker.remove();
      this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconRed).addTo(this.map); // add the marker onclick
      console.log(this.answerGiven);
      this.infoMessage = "Not correct! You are " + (this.distance / 1000) + " km away from the target! Try it again!";
      this.tryLeft = false;
    } else {
      this.showSolution();
      this.marker.remove();
      this.marker = Leaflet.marker([this.clicked_coordinates.lat, this.clicked_coordinates.lng], this.markerIconRed).addTo(this.map); // add the marker onclick
      this.infoMessage = "Not correct! You are still " + (this.distance / 1000) + " km away from the target! :(";
      this.answerGiven = true;
    }
  }
}


