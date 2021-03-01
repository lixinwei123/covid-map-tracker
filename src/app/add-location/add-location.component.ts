import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import {MapStyleConstants} from '../mapStyle';
import { UserInfoService } from '../user-info.service';

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
  currentDate: any;
  service = new google.maps.places.AutocompleteService();
@ViewChild('map') mapElement: ElementRef;
  map: any;
  
  constructor(mapConst: MapStyleConstants, 
    public modalCtrl: ModalController, 
    private zone: NgZone, 
    public alertCtrl: AlertController,
    private uInfo: UserInfoService,
    private afData: AngularFireDatabase) { 
    this.mapStyle = mapConst.darkThemeMap;
    this.getGPS()
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

    
  }

  ngOnInit() {
    // console.log(formatDate);
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
    this.alert("error", "Please make sure all three fields are selected and filled")
    return
  }


  if(this.autocomplete.query == null || this.autocomplete.query == undefined || this.autocomplete.query.length == 0){
    this.alert("error", "please make sure the location searched is valid")
    return
  }

  let startHour = this.startHour.split("T")[1].split(":")[0]
  let endHour = this.endHour.split("T")[1].split(":")[0]

  if(parseInt(endHour)  < parseInt (startHour)){
    this.alert("error", "The starting hour cannot be greater than the ending hour")
    return
  }
  let date = this.date.split("T")[0].split(":")[0]
  let currentDay = new Date().getDate()
  let currentMonth = new Date().getMonth() + 1
  let selectedDay = date.split("-")[2]
  let selectedMonth = date.split("-")[1]
  if(parseInt(selectedDay) > currentDay || parseInt(selectedMonth) > currentMonth){
    this.alert("error","please make sure the date entered is correct")
    return
  }
  console.log(this.date) 
  let latlon = {lat: this.lat,lon:this.lon}
  let dataObj = {
    startHour: startHour,
    endHour: endHour,
    date: date,
    latlon:latlon,
    address: this.autocomplete.query
  }
  console.log(date)
  console.log(endHour)
  let usrInfo = this.uInfo.getUserInfo()
  console.log(usrInfo.uid)
  this.afData.database.ref('alerts').child(usrInfo.uid).push(dataObj).then( (success) =>{
    // console.log(success)
    this.afData.database.ref('addresses').child(this.autocomplete.query).child(usrInfo.uid).child(success.key).set({hasRona: this.uInfo.hasCorona, data:dataObj}).then(() =>{
      this.alert("success!", "the data has been successfully uploaded")
      this.modalCtrl.dismiss()
    },
    (fail2) =>{
      this.alert("error",fail2)
    }
    )
   
  },
  (fail) =>{
    this.alert("error",fail)
  }
  );
  
 }


 async alert(title,content) {
  const alert = await this.alertCtrl.create({
    // cssClass: 'my-custom-class',
    header: title,
    // subHeader: 'Subtitle',
    message: content,
    buttons: ['OK']
  });
  await alert.present();
}


}


