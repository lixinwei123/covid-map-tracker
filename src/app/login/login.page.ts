import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController } from '@ionic/angular';
import {RegisterComponent} from '../register/register.component';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import {UserInfoService} from "../user-info.service"
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  password: any;
  email: any;
  constructor(public menuCtrl: MenuController, public modalCtrl: ModalController,
    public alertCtrl: AlertController,
     public afAuth: AngularFireAuth,
     public router: Router,
     private uInfo: UserInfoService
     ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

 async  goToRegister(){
    const regModal = await this.modalCtrl.create({
      component: RegisterComponent,
      cssClass: "../register.component.scss"
    });
   return await regModal.present();
  }
  
  async login(){
    try{
          this.afAuth.signInWithEmailAndPassword(this.email,this.password).then(res =>{
          console.log("Logged in ha",res.user);
          this.uInfo.setUserInfo(res.user.uid);
          
        if(res.user.uid){
          this.router.navigateByUrl('/tabs')
        }
        },
        fail =>{
          this.alertError("invalid login information, wrong password or email?")
        }
        );
    }
    catch  (e) {
      console.log(e)
      this.alertError("invalid login information, wrong password or email?")
    }
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
