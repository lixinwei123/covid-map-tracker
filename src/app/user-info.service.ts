import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
usrData: any;
usrId: any;
  constructor(public afAuth: AngularFireAuth, public  afData: AngularFireDatabase) {

   }

   setUserInfo(user){
    return this.afData.database.ref('users/' + user.uid).on('value',dataSnap =>{
     this.usrData = dataSnap.val();
     this.usrId = user.uid
     console.log("loaded current user: ", this.usrData);

   });
 }

 setUserInfoById(id){
  return this.afData.database.ref('users/' + id).on('value',dataSnap =>{
   this.usrData = dataSnap.val();
   this.usrId = id
   console.log("loaded current user: ", this.usrData);

 });
}

getUserInfo(){
	return this.usrData;
}
}
