import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Meet }             from '../../models/meet';
import { Swimmer }          from '../../models/swimmer';

import { MeetService }      from '../../providers/meet.service';
import { SwimData }         from '../../providers/swimdata';

@Component({
  selector: 'page-home',
  templateUrl: 'meetentry.html'
})
export class MeetEntryPage {
  errorMessage: string;
  meet: Meet;
  swimmer: Swimmer;
  entries: Array<any>;
  totalCost: number;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      public config: SwimData) {
        this.meet = this.params.get('meet');
        this.swimmer = this.params.get('swimmer');
        this.entries = this.params.get('entries');
        this.totalCost = meetService.getTotalCostForEntries(this.entries, this.meet);
  }

}
