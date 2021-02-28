import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { ModalController, NavController } from '@ionic/angular';
import { AutoCompletePage } from '../auto-complete/auto-complete.page';
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
  address: any;
  mapStyle : any;
@ViewChild('map') mapElement: ElementRef;
  map: any;
  
  constructor(mapConst: MapStyleConstants, public modalCtrl: ModalController) { 
    this.mapStyle = mapConst.darkThemeMap;
    // this.address = {
    //     place: ''
    // };
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

async showAddressModal () {
    let modal = await this.modalCtrl.create({
        component: AutoCompletePage
    });
    let me = this;
    modal.onDidDismiss().then((data : any) =>{
        console.log(data.data.latlon);
        let latlon = data.data.latlon
        // this.address.place = data;
        this.address = data.data.location
        this.addMap(latlon.lat,latlon.lon);
    })
    modal.present();
  }
}


