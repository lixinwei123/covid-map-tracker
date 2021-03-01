import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  progressVal: any = 0
  isRona: any = false;
  public sympForm = [
    { val: 'Fever or chills', isChecked: false },
    { val: 'Cough', isChecked: false },
    { val: 'Shortness of breath or difficulty breathing', isChecked: false },
    {val: 'Muscle or body aches', isChecked: false},
    {val: 'Headache',isChecked:false},
    {val: 'New loss of taste or smell',isChecked:false},
    {val: 'Sore throat',isChecked:false},
    {val:'Congestion or runny nose', isChecked: false},
    {val: 'Nausea or vomiting', isChecked: false},
    {val:'Diarrhea',isChecked: false}

  ];
  constructor(public alertCtrl: AlertController, private uInfo: UserInfoService) { }

  ngOnInit() {
  }

  evalDanger(entry){
    let sympCount = 0
    for(let index in this.sympForm){
      if(this.sympForm[index].isChecked){
        sympCount += 1
      }
    }
    console.log(entry)
    if(entry.isChecked == false){
      sympCount += 1
    }else{
      sympCount -= 1
    }
    this.progressVal = sympCount / 10 
  }

  async confirmRona(){
    console.log(this.isRona)
    this.isRona = !this.isRona
    const alert = await this.alertCtrl.create({
      header: "Are you sure? users will be notified",
      buttons:[
        {
          text:"confirm",
          handler: () =>{
            this.isRona =  !this.isRona
            this.uInfo.setCorona(this.isRona)
          }
        },
        {
          text: "cancel",
          role: 'cancel'
        }
      ]
    })
    await alert.present();
    console.log()
  }

}
