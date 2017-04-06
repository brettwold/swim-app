import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { MeetPayPage }      from './meetpay.ts'

import { Meet }             from '../../models/meet';
import { Swimmer }          from '../../models/swimmer';
import { Entry }            from '../../models/entry';

import { MeetService }      from '../../providers/meet.service';
import { SwimData }         from '../../providers/swimdata';

@Component({
  selector: 'meet-times',
  templateUrl: 'meetentry.html'
})
export class MeetEntryPage {
  errorMessage: string;
  meet: Meet;
  swimmer: Swimmer;
  entries: Array<any>;
  totalCost: number;

  entry: Entry;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      public config: SwimData) {
    this.meet = this.params.get('meet');
    this.swimmer = this.params.get('swimmer');
    this.entries = this.params.get('entries');

    this.entry = new Entry({
      meet: this.meet,
      swimmer: this.swimmer,
      entries: this.entries,
      admin_fee: this.meet.admin_fee,
      cost_per_race: this.meet.cost_per_race
    });
  }

  public confirmAndPay() {
    this.navCtrl.push(MeetPayPage, { entry: this.entry } );
  }
}
