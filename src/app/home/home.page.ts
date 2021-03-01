import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../user-info.service';
// import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  uInfo: any;
  constructor(private uInfoProvider: UserInfoService, private afData: AngularFireDatabase) { 
    this.uInfo = this.uInfoProvider.getUserInfo();
    this.loadAlerts()
  }

  ngOnInit() {
  
  }

  loadAlerts(){
    this.afData.database.ref("addresses").on('child_changed', datasnap =>{
      console.log(datasnap)
    })
  }

}
