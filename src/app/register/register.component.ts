import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
// import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuth } from "@angular/fire/auth";
import {AngularFireDatabase} from "@angular/fire/database"
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
// import { File } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
@Injectable()
export class RegisterComponent implements OnInit {

  text = "";
  password = "";
  email = "";
  passwordC = "";
  emailC = "";
  firstname = "";
  lastname = "";
  constructor(public navCtrl: NavController,
   public modalCtrl: ModalController, 
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private afData: AngularFireDatabase
    ) {
    // console.log('Hello RegisterComponent Component');
    this.text = 'Hello World';
  }

  closeModal(){
    this.modalCtrl.dismiss();
    // console.log('clicked on closeModal function');
  }
  ngOnInit() {}

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
  finishRegistration(){
    //var database = Database.database();
    //var ref = database.ref("ID");
    //ref.on('ID', this.getID, this.err);
  
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.password != this.passwordC){
      this.alertError("Passwords do not match.");
    }
    else if (this.email != this.emailC){
      this.alertError("Emails do not match.");
    }
    else if(this.password.length < 7){
      // console.log(this.password, this.passwordC)
      this.alertError("The password should be at least 7 characters long.");
    }
    else if (re.test(String(this.email).toLowerCase()) == false){
      this.alertError("bad email");
    }
    else if (this.firstname == "")
    {
      this.alertError("Please enter your first name.")
    }
      else if (this.lastname == "")
    {
      this.alertError("Please enter your last name.")
    }
    else{

      
    var result = this.afAuth.createUserWithEmailAndPassword(this.email,this.password).then (res =>{
       var usrInfo = {
       uid: res.user.uid,
       email:this.email,
       firstname: this.firstname,
       lastname: this.lastname,
       hasCorona: false
     }
     this.afData.database.ref('users').child(usrInfo.uid).update(usrInfo);
        //  console.log("registered",res.user.uid)
        this.closeModal()
    },
      fail =>{
        this.alertError("invalid information or this email has already been used")
      }
    );
    }
  }

}
