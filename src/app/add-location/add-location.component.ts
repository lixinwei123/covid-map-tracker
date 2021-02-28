import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
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

  lat: any = "";
  lon: any = "";
  mapStyle : any;
  autocompleteItems;
  autocomplete;
  address: any
  service = new google.maps.places.AutocompleteService();
@ViewChild('map') mapElement: ElementRef;
  map: any;
  
  constructor(mapConst: MapStyleConstants, public modalCtrl: ModalController, private zone: NgZone) { 
    this.mapStyle = mapConst.darkThemeMap;
    this.getGPS()
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ngOnInit() {

  }
   getGPS(){
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

  chooseItem(item: any) {
    this.address = item;
    this.geoCode(this.address)
    this.autocompleteItems = []
    this.autocomplete.query = this.address
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
     this.autocompleteItems = [];
     return;
    }

    let me = this;
    this.service.getPlacePredictions({
    input: this.autocomplete.query,
    componentRestrictions: {
      country: 'us'
    }
   }, (predictions, status) => {
     me.autocompleteItems = [];

   me.zone.run(() => {
     if (predictions != null) {
        predictions.forEach((prediction) => {
          me.autocompleteItems.push(prediction.description);
        });
       }
     });
   });
  }

  geoCode(address:any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    this.lat = results[0].geometry.location.lat();
    this.lon = results[0].geometry.location.lng();
    this.addMap(this.lat,this.lon);
    return 
   });
 }
}


