import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
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
  progressBarColor: any = "success"
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
  constructor(public alertCtrl: AlertController, private uInfo: UserInfoService, public router: Router,
    private afData: AngularFireDatabase) {
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
    this.date = currentYear + "-" + currentMonth + "-" + currentDay
    this.maxVal = this.date
    console.log(this.date)
    // this.isRona = this.uInfo.getUserInfo().hasCorona
   }

  ngOnInit() {
  }

  updateRonaDate(){
    console.log(this.date)
    this.uInfo.setCoronaDate(this.date.split("T")[0]);
    this.handleRona()
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
        if(this.progressVal < 0.4){
          this.progressBarColor = "success"
        }else if(this.progressVal >= 0.4 && this.progressVal < 0.7){
          this.progressBarColor = "warning"
        }else{
          this.progressBarColor = "danger"
        }
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
    if(this.progressVal < 0.4){
      this.progressBarColor = "success"
    }else if(this.progressVal >= 0.4 && this.progressVal < 0.7){
      this.progressBarColor = "warning"
    }else{
      this.progressBarColor = "danger"
    }
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
            this.handleRona()
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

  handleRona(){
    let alerts = this.uInfo.getUserAlerts()
    let one_day=1000*60*60*24;
    console.log(alerts)
    for(let id in alerts){
      console.log(alerts[id])
      let alertDate =alerts[id].date
      alertDate = new Date(alertDate).getTime()
      let ronaDate = new Date(this.date).getTime()
      let dayDiff = Math.round((Math.abs((alertDate - ronaDate))/one_day))
      if(dayDiff <14 && this.isRona){
        this.afData.database.ref("addresses").child(alerts[id].address).child(this.uInfo.getUserId()).child(id).child("hasRona").set(true).then( (success) =>{
          console.log("users all notified")
        })
      }else {
        this.afData.database.ref("addresses").child(alerts[id].address).child(this.uInfo.getUserId()).child(id).child("hasRona").set(false).then( (success) =>{
          console.log("users all notified")
        })
      }
    }
  }

  goToManagePlace(){
    this.router.navigateByUrl('/manage-place')
  }

}
