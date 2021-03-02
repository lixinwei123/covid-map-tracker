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
  alertList: any;
  sharedAlerts : any
  constructor(private uInfoProvider: UserInfoService, private afData: AngularFireDatabase) { 
    this.uInfo = this.uInfoProvider.getUserInfo();
    this.sharedAlerts = []
    this.loadAlerts()
  }

  ngOnInit() {
  
  }

  loadAlerts(){
    this.alertList = this.uInfoProvider.getUserAlerts()
    if(this.alertList == undefined){
      setTimeout(() => {
        this.loadAlerts()
      }, 1000);
    }else{
      this.afData.database.ref("addresses").on("child_added", datasnap =>{
        // let key = this.getKey(datasnap.val())
        // let selfAlertObj = this.isAddressInList(datasnap.key)
        // if( selfAlertObj && key != this.uInfoProvider.getUserId()){ 
        //   let alertObjs = datasnap.val()[key] 
        //   for(let key2 in alertObjs){
        //     if(alertObjs[key2].hasRona == true && alertObjs[key2].date == selfAlertObj.date ){
        //       this.sharedAlerts.push(
        //         alertObjs[key2]
        //       )
        //     }
        //   }
        // }
        this.loadSharedAlerts(datasnap)
        console.log("child_added key",datasnap.key)

        console.log("child_added val", datasnap.val())
      })
      this.afData.database.ref("addresses").on("child_changed",datasnap =>{
        this.loadSharedAlerts(datasnap)
        console.log("child_changed key", datasnap.key)
        console.log("child_changed val", datasnap.val())
      })
    }
  }


  isAddressInList(addr){
    let alertObjs = []
    for(let index in this.alertList){
      if(this.alertList[index].address == addr){
         alertObjs.push(this.alertList[index])
      }
    }
    return alertObjs
  }

  getKey(data){
    let keys = []
    for(let tempKey in data){
       keys.push(tempKey)
    }
    return keys
  }

  loadSharedAlerts(datasnap){
    let usrIds = this.getKey(datasnap.val()) //get all the userIds out the object
    let selfAlertObjs = this.isAddressInList(datasnap.key) // the object that contains all the alert objects that match address
    // console.log("cats",selfAlertObj,key)
    for(let usrIndex in usrIds){
      if( selfAlertObjs.length > 0 && usrIds[usrIndex] != this.uInfoProvider.getUserId()){ //if self has addresses matches the given address and usrId diff
        console.log("first if statement")
        let alertObjs = datasnap.val()[usrIds[usrIndex]] //get all the alertObjs given a usrId
        console.log("first obj",alertObjs)
        console.log("second obj", selfAlertObjs)
        for(let key2 in alertObjs){ 
          for(let key3 in selfAlertObjs){
            if(alertObjs[key2].hasRona == true && alertObjs[key2].data.date == selfAlertObjs[key3].date){
              this.sharedAlerts.push(
                alertObjs[key2]
              )
            }
          }
        }
        console.log(this.sharedAlerts,"shared alerts")
      }
    }

  }
}
