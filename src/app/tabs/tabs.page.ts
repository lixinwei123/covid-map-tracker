import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddLocationComponent } from '../add-location/add-location.component';
import { EventsService } from '../events.service';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  uInfo:any
  constructor(public modalCtrl: ModalController, public events: EventsService) {
    this.events.subscribe('user:loaded',(data: any) => {
      this.uInfo = data
      console.log("big data",this.uInfo)
    })
   }

  ngOnInit() {
  }

  test(){
    // console.log("test")
  }

  async  goToAddLocation(){
    console.log(this.uInfo)
    const regModal = await this.modalCtrl.create({
      component: AddLocationComponent,
      componentProps: {
        "userInfo": this.uInfo
     }
      // cssClass: "../add-location.component.scss"
    });
   return await regModal.present();
  }

}
