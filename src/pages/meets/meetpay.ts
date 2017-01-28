import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Entry }            from '../../models/entry';
import { Meet }             from '../../models/meet';
import { Swimmer }          from '../../models/swimmer';

import { MeetService }      from '../../providers/meet.service';
import { EntryService }      from '../../providers/entry.service';
import { SwimData }         from '../../providers/swimdata';

@Component({
  selector: 'page-home',
  templateUrl: 'meetpay.html'
})
export class MeetPayPage {
  errorMessage: string;
  entry: Entry;
  meet: Meet;
  swimmer: Swimmer;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      private entryService: EntryService,
      public config: SwimData) {
        this.entry = this.params.get('entry');
        this.meet = this.entry.meet;
        this.swimmer = this.entry.swimmer;
  }

  public pay() {
    // save entry here
    console.log("hhshhs");
    this.entryService.sendEntry(this.entry).subscribe((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });

    // TODO submit to server

    // TODO start payment process

    // TODO confirm payment details to server

  }

}
