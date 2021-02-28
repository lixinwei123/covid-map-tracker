import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { NavController } from '@ionic/angular';
import {MapStyleConstants} from '../mapStyle';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google: any;
@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})

export class AddLocationComponent implements OnInit {
    
  options: any;
  geolocation: any;
  currentPos: any;
  lat: any = "";
  lon: any = "";
  mapStyle : any;
@ViewChild('map') mapElement: ElementRef;
  map: any;
  
  constructor(mapConst: MapStyleConstants) { 
    this.mapStyle = mapConst.darkThemeMap;
    this.getGPS()
  }

  ngOnInit() {

  }

   getGPS(){
    // navigator.geolocation.getCurrentPosition(this.successGPS,this.errorGPS,{enableHighAccuracy : true});
    navigator.geolocation.getCurrentPosition( (success) => {
        this.lat = success.coords.latitude; //switch this with user searched 
        this.lon = success.coords.longitude;
        this.addMap(this.lat,this.lon);
    }),
    (fail) =>{
        console.log(fail);
    }
}

addMap(lat,long){

    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
    center: latLng,
    zoom: 15,
    styles: this.mapStyle,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();

}

addMarker(){
    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter(),
    draggable: true
    });

    let content = "<p>This is your current position !</p>";          
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });
}
}


