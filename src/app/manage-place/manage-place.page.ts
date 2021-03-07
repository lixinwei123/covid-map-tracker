import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController, NavController } from '@ionic/angular';
import { AddLocationComponent } from '../add-location/add-location.component';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-manage-place',
  templateUrl: './manage-place.page.html',
  styleUrls: ['./manage-place.page.scss'],
})
export class ManagePlacePage implements OnInit {
  alertEvents : any;
  eventList: any;
  constructor(public navCtrl: NavController, private uInfo: UserInfoService, private afData: AngularFireDatabase,
    public modalCtrl: ModalController,
    public ngZone: NgZone
    ) {

      this.loadUserData()
     }

  ngOnInit() {
    this.loadUserData()
  }

  goBack(){
    this.navCtrl.back()
  }

  loadUserData(){
    this.alertEvents = this.uInfo.getUserAlerts();
    if(this.alertEvents == undefined || this.alertEvents.length < 1 || this.alertEvents == null ){
      setTimeout(() => {
        this.loadUserData()
      }, 1000);
    }else{
      // console.log("get big data",this.alertEvents)
      this.eventList = []
      for(let obj in this.alertEvents){
          this.alertEvents[obj].startHour = this.alertEvents[obj].startHour.split(":")[0] + ":" + "00"
          this.alertEvents[obj].endHour = this.alertEvents[obj].endHour.split(":")[0] + ":" + "00"
        this.alertEvents[obj].id = obj
        this.eventList.push(this.alertEvents[obj])
        // console.log(this.alertEvents[obj])
      }
    }
  }

  async modifyEvent(event) {
    // console.log( event.startHour)
    let id = event.id
    const modal = await this.modalCtrl.create({
      component: AddLocationComponent,
      
      componentProps: {
         "addressP": event.address,
         "startHourP": this.alertEvents[id].startHour,
         "endHourP": this.alertEvents[id].endHour,
         "dateP": event.date,
         "latlonP": event.latlon,
         "eventId": event.id
      }
    });
    modal.onDidDismiss().then( (doReload) =>{
      // console.log(doReload)
      if(doReload.data){
        this.loadUserData()
      }

    })
    return await modal.present();
  }

  deleteEvent(event){
    // console.log(this.uInfo.getUserId())
    this.afData.database.ref("alerts").child(this.uInfo.getUserId()).child(event.id).remove((success) =>{
      // console.log("data deleted")
      for(let index in this.eventList){
        if(this.eventList[index].id == event.id){
          // console.log(index)
          this.ngZone.run( () =>{
            this.eventList.splice(index,1)
          })
          return
        }
      }
    })
  }



}
