import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Meet }             from '../../models/meet';

import { MeetService }      from '../../providers/meet.service';
import { SwimData }         from '../../providers/swimdata';

@Component({
  selector: 'page-home',
  templateUrl: 'meetentry.html'
})
export class MeetEntryPage {
  errorMessage: string;
  meets: Array<Meet>;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      public config: SwimData) {
  }

}
