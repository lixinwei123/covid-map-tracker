import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../user-info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  uInfo: any;
  constructor(private uInfoProvider: UserInfoService) { 
    this.uInfo = this.uInfoProvider.getUserInfo();
  }

  ngOnInit() {
    // this.firstName= 
    // console.log(this.firstName,"data")
  }

}
