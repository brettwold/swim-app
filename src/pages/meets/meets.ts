import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { MeetDetailPage }  from '../../pages/meets/meetdetail';

import { Meet }             from '../../models/meet';

import { MeetService }      from '../../providers/meet.service';
import { SwimData }         from '../../providers/swimdata';

@Component({
  selector: 'page-home',
  templateUrl: 'meets.html'
})
export class MeetsPage {
  errorMessage: string;
  meets: Array<Meet>;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      public config: SwimData) {
        this.getMeets();
  }

  getMeets() {
    this.meetService.getMeets()
                     .subscribe(
                       meets => {
                         this.meets = meets;
                         console.log(meets);
                       },
                       error =>  {
                         console.log(error);
                         this.errorMessage = <any>error
                       });
  }

  public selectMeet(meet :Meet) {
    this.navCtrl.push(MeetDetailPage, {
      meet: meet
    });
  }
}
