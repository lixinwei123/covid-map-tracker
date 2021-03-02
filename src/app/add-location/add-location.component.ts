import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController, ModalController, NavController, NavParams } from '@ionic/angular';
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
  maxDate: any;
  isModify: boolean = false;
  usrInfo: any;
  service = new google.maps.places.AutocompleteService();
@ViewChild('map') mapElement: ElementRef;
  map: any;
  
  constructor(mapConst: MapStyleConstants, 
    public modalCtrl: ModalController, 
    private zone: NgZone, 
    public alertCtrl: AlertController,
    private uInfo: UserInfoService,
    private afData: AngularFireDatabase,
    public navParam: NavParams) { 
    this.mapStyle = mapConst.darkThemeMap;
 
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    if(this.navParam.get("addressP")){
      this.address = this.navParam.get("addressP")
      this.autocomplete.query = this.address
      this.isModify = true
    }
    if(this.navParam.get("startHourP")){
      this.startHour = this.navParam.get("startHourP")
      this.isModify = true
    }
    if(this.navParam.get("endHourP")){
      this.endHour = this.navParam.get("endHourP")
    }
    if(this.navParam.get("dateP")){
      this.date = this.navParam.get("dateP")
    }
    if(this.navParam.get("latlonP")){
      this.lat = this.navParam.get("latlonP").lat 
      this.lon = this.navParam.get("latlonP").lon
      console.log(this.lat,"hi")
      this.loadMap()
    }else{
      this.getGPS()
    }

 

    let currentDay: any = new Date().getDate()
    if(currentDay < 10){
      currentDay = "0" + currentDay.toString()
    }
    let currentMonth:any = new Date().getMonth() + 1
    if(currentMonth < 10){
      currentMonth = "0" + currentMonth.toString()
    }
    let currentYear = new Date().getFullYear()
    this.maxDate = currentYear + "-" + currentMonth + "-" + currentDay
  }

  loadMap(){
    if(this.mapElement){
      this.addMap(this.lat,this.lon)
    }else{
      setTimeout(() => {
        this.loadMap()
      }, 1000);
    }
  }
  ngOnInit() {
    this.loadUserData()
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

loadUserData(){
  this.usrInfo = this.uInfo.getUserInfo()
  if(this.usrInfo == undefined){
    setTimeout(() => {
      this.loadUserData()
    }, 1000);
  }else{
    console.log("loaded user info on add-location",this.usrInfo)
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
    this.modalCtrl.dismiss(false)
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
  let startHour,endHour
  console.log(this.autocompleteItems)

  try{
    startHour = this.startHour.split("T")[1].split(":")[0]
  }catch{
    startHour = this.startHour
  }
  try{
    endHour = this.endHour.split("T")[1].split(":")[0]
  }catch{
    endHour = this.endHour
  }


  if(parseInt(endHour)  < parseInt (startHour)){
    this.alert("error", "The starting hour cannot be greater than the ending hour")
    return
  }

  if(!(this.autocompleteItems.includes(this.autocomplete.query)) && this.autocompleteItems.length > 0){
    this.autocomplete.query = this.autocompleteItems[0]
  }
  let date = this.date.split("T")[0].split(":")[0]
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
  if(!this.isModify){
    this.afData.database.ref('alerts').child(this.usrInfo.uid).push(dataObj).then( (success) =>{
      this.afData.database.ref('addresses').child(this.autocomplete.query).child(this.usrInfo.uid).child(success.key).set({hasRona: this.usrInfo.hasCorona, data:dataObj}).then(() =>{
        this.alert("success!", "the data has been successfully uploaded")
        this.uInfo.setUserAlerts()
        this.modalCtrl.dismiss(true)
      },
      (fail2) =>{
        this.alert("error",fail2)
      }
      )
     
    },
    (fail) =>{
      this.alert("error",fail)
    });
  }else{
    this.afData.database.ref('alerts').child(this.usrInfo.uid).child(this.navParam.get("eventId")).update(dataObj).then( (success) =>{
      this.afData.database.ref('addresses').child(this.navParam.get("addressP")).child(this.usrInfo.uid).child(this.navParam.get("eventId")).remove( () =>{
        this.afData.database.ref('addresses').child(this.autocomplete.query).child(this.usrInfo.uid).child(this.navParam.get("eventId")).set({hasRona: this.usrInfo.hasCorona, data:dataObj}).then(() =>{
          this.alert("success!", "the data has been successfully modified")
          this.uInfo.setUserAlerts()
          this.modalCtrl.dismiss(true)
        },
        (fail2) =>{
          this.alert("error",fail2)
        }
        )
      })
    })
  }

  
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


