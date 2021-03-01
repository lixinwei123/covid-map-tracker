import { Component } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Platform } from '@ionic/angular';
import {UserInfoService} from './user-info.service';
import {HomePage} from './home/home.page';
import { LoginPage } from './login/login.page';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  rootPage: any;
  constructor(platform: Platform, private afAuth: AngularFireAuth, private uInfo: UserInfoService,
    private router: Router
    ) {
    platform.ready().then(() =>{
      this.afAuth.onAuthStateChanged(user =>{
        if(user){
          this.uInfo.setUserInfo(user)
          this.uInfo.setUserAlerts()
          this.loadUserInfo()
        }else{
          this.router.navigateByUrl('/login')
        }
      })
    })
  }

  loadUserInfo(){
    let usrInfo = this.uInfo.getUserInfo();
     if (usrInfo == undefined ){
      setTimeout(() => {
        this.loadUserInfo();
      },1000);
    }

     else{
        this.router.navigateByUrl('/tabs')
  }
}
}
