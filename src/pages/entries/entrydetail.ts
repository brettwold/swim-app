import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Entry }            from '../../models/entry';

import { MeetService }      from '../../providers/meet.service';
import { SwimmersService }  from '../../providers/swimmers';
import { SwimData }         from '../../providers/swimdata';

@Component({
  selector: 'page-home',
  templateUrl: 'entrydetail.html'
})
export class EntryDetailPage {
  errorMessage: string;
  entry: Entry;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      private swimmersService: SwimmersService,
      public config: SwimData) {
        this.entry = this.params.get('entry');
  }

}
