import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddLocationComponent } from '../add-location/add-location.component';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  test(){
    console.log("test")
  }

  async  goToAddLocation(){
    const regModal = await this.modalCtrl.create({
      component: AddLocationComponent,
      // cssClass: "../add-location.component.scss"
    });
   return await regModal.present();
  }

}
