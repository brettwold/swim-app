import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Meet }        from '../../models/meet';

import { MeetService }     from '../../services/meet.service';
import { SwimData }       from '../../services/swimdata.service';

@Component({
  selector: 'page-home',
  templateUrl: 'meets.html'
})
export class MeetsPage {
  errorMessage: string;
  meets: Array<Meet>;
  mode = 'Observable';
  config: any = {};

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      private swimData: SwimData) {

            this.config = swimData;
  }

  getMeets(id) {
    this.meetService.getMeets()
                     .subscribe(
                       meets => this.meets = meets,
                       error =>  this.errorMessage = <any>error);
  }
}
