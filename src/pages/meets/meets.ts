import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { MeetDetailPage }  from '../../pages/meets/meetdetail';

import { Meet }             from '../../models/meet';

import { MeetService }      from '../../providers/meet.service';
import { SwimData }         from '../../providers/swimdata';

@Component({
  selector: 'meet-times',
  templateUrl: 'meets.html'
})
export class MeetsPage {
  meets: Array<Meet>;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public toastCtrl: ToastController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      public config: SwimData) {
        this.getMeets();
  }

  getMeets() {
    this.meetService.getMeets().subscribe(meets => {
      this.meets = meets;
    }, error =>  {
      console.log(error);
      let toast = this.toastCtrl.create({
        message: "Unable to synchronise meet information at this time please try again later",
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      toast.present();
    });
  }

  public selectMeet(meet :Meet) {
    this.navCtrl.push(MeetDetailPage, {
      meet: meet
    });
  }
}
