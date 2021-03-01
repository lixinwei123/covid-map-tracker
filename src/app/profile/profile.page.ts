import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
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
  date: any;
  usrData: any;
  maxVal: any;
   sympForm:any = [
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
  constructor(public alertCtrl: AlertController, private uInfo: UserInfoService, public router: Router) {
    this.loadUserData()
    let currentDay: any = new Date().getDate()
    if(currentDay < 10){
      currentDay = "0" + currentDay.toString()
    }
    let currentMonth:any = new Date().getMonth() + 1
    if(currentMonth < 10){
      currentMonth = "0" + currentMonth.toString()
    }
    let currentYear = new Date().getFullYear()
    // this.date = currentYear + "-" + currentMonth + "-" + currentDay
    this.maxVal = this.date
    console.log(this.date)
    // this.isRona = this.uInfo.getUserInfo().hasCorona
   }

  ngOnInit() {
  }

  updateRonaDate(){
    console.log(this.date)
    this.uInfo.setCoronaDate(this.date.split("T")[0]);
  }
  loadUserData(){
    this.usrData = this.uInfo.getUserInfo();
    if(this.usrData == undefined){
      setTimeout(() => {
        this.loadUserData()
      }, 1000);
    }else{
      this.isRona = this.usrData.hasCorona;
      if(this.usrData.coronaDate){
        this.date = this.usrData.coronaDate
      }
      if(this.usrData.diagnostic){
        this.sympForm = this.usrData.diagnostic
        let sympCount = 0
        for(let index in this.sympForm){
          if(this.sympForm[index].isChecked){
            sympCount += 1
          }
        }
        this.progressVal = sympCount / 10
      }
    }
  }

  evalDanger(entry){
    let sympCount = 0
    let tempForm = []
    for(let index in this.sympForm){
      tempForm.push({val:this.sympForm[index].val,isChecked:this.sympForm[index].isChecked})
      if(this.sympForm[index].isChecked){
        sympCount += 1
      }
      if(this.sympForm[index].val == entry.val){
        tempForm[index].isChecked =  ! this.sympForm[index].isChecked
      }
    }
    if(entry.isChecked == false){
      sympCount += 1
    }else{
      sympCount -= 1
    }
    this.progressVal = sympCount / 10 
    this.uInfo.setUserDiagnostic(tempForm)
  }

  async confirmRona(){
    console.log(this.isRona)
    console.log(this.date)
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
          role: 'cancel',
          handler:() =>{
            this.isRona = this.isRona
          }
        }
      ]
    })
    await alert.present();
    console.log()
  }

  goToManagePlace(){
    this.router.navigateByUrl('/manage-place')
  }

}
