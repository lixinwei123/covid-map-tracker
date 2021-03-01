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
hasCorona: boolean = false;
  constructor(public afAuth: AngularFireAuth, public  afData: AngularFireDatabase) {

   }

   setUserInfo(user){
    return this.afData.database.ref('users/' + user.uid).on('value',dataSnap =>{
     this.usrData = dataSnap.val();
     this.usrId = user.uid
     console.log("loaded current user: ", this.usrData);

   });
 }

 setCorona(bool){
    this.afData.database.ref('users/' + this.usrId).child("hasCorona").set(bool).then(() =>{
      this.hasCorona = bool;
    });
 }

 setCoronaDate(date){
  this.afData.database.ref('users/' + this.usrId).child("coronaDate").set(date).then(() =>{
    console.log("date set!")
  });
 }

 setUserDiagnostic(data){
  this.afData.database.ref('users/' + this.usrId).child("diagnostic").set(data).then(() =>{
    console.log("date set!")
  });
 }

 setUserInfoById(id){
  return this.afData.database.ref('users/' + id).on('value',dataSnap =>{
   this.usrData = dataSnap.val();
   this.usrId = id
   console.log("loaded current user: ", this.usrData);

 });
}

// getHasRona(){
//   return this.usrData.hasCorona
// }
getUserInfo(){
	return this.usrData;
}
}
