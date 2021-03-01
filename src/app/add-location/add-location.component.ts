import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
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
  date: any;
  startHour: any;
  endHour: any;
  service = new google.maps.places.AutocompleteService();
@ViewChild('map') mapElement: ElementRef;
  map: any;
  
  constructor(mapConst: MapStyleConstants, public modalCtrl: ModalController, private zone: NgZone, public alertCtrl: AlertController) { 
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


  chooseItem(item: any) {
    this.address = item;
    this.geoCode(this.address)
    this.autocompleteItems = []
    this.autocomplete.query = this.address
  }

  search(){
    this.geoCode(this.autocomplete.query)
    this.autocompleteItems = []
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

 submitForum(parseData){
  if(!parseData){
    this.modalCtrl.dismiss()
    return;
  }
  if(this.startHour == undefined || this.endHour == undefined || this.date == undefined){
    this.alertError("Please make sure all three fields are selected and filled")
    return
  }

  let startHour = this.startHour.split("T")[1].split(":")[0]
  let endHour = this.endHour.split("T")[1].split(":")[0]
  let date = this.date.split("T")[0].split(":")[0]
  console.log(date)
  console.log(endHour)
   this.modalCtrl.dismiss()
 }


 async alertError(error) {
  const alert = await this.alertCtrl.create({
    // cssClass: 'my-custom-class',
    header: 'Error',
    // subHeader: 'Subtitle',
    message: error,
    buttons: ['OK']
  });

  await alert.present();
}
}


