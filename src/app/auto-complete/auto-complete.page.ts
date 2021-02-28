import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
declare var google: any;
@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.page.html',
  styleUrls: ['./auto-complete.page.scss'],
})
export class AutoCompletePage implements OnInit {
  autocompleteItems;
  autocomplete;

  latitude: number = 0;
  longitude: number = 0;
  geo: any
  address: any;

  service = new google.maps.places.AutocompleteService();
  constructor(public modalCtrl: ModalController,private zone: NgZone) { 
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.geo = item;
    this.geoCode(this.geo)
    //convert Address to lat and long
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

  //convert Address string to lat and long
  geoCode(address:any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    this.latitude = results[0].geometry.location.lat();
    this.longitude = results[0].geometry.location.lng();
    this.modalCtrl.dismiss({location:address,
      latlon:{lat:this.latitude,lon:this.longitude}});
    return 
   });
 }

  ngOnInit() {
  }

}
