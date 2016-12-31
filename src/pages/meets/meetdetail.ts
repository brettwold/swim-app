import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { MeetEntryPage }    from './meetentry.ts'

import { Meet }             from '../../models/meet';
import { Swimmer }          from '../../models/swimmer';

import { MeetService }      from '../../providers/meet.service';
import { SwimmersService }  from '../../providers/swimmers';
import { SwimData }         from '../../providers/swimdata.service';

@Component({
  selector: 'page-home',
  templateUrl: 'meetdetail.html'
})
export class MeetDetailPage {
  errorMessage: string;
  swimmers: any;
  swimmers_list: Array<Swimmer>;
  meet: Meet;
  swimmer_regno: string;
  swimmer: Swimmer;
  entry_events: any;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private meetService: MeetService,
      private swimmersService: SwimmersService,
      public config: SwimData) {
        this.meet = this.params.get('meet');
        this.refreshSwimmers();
  }

  public refreshSwimmers() {
    this.swimmersService.load().then((swimmers) => {
      this.swimmers = swimmers;
      this.swimmers_list = [];
      for(let regno in swimmers) {
        this.swimmers_list.push(swimmers[regno]);
      }
    });
  }

  public selectSwimmer() {
    this.swimmer = new Swimmer(this.swimmers[this.swimmer_regno]);
    console.log(this.swimmer);

    this.meet.getEntryEvents(this.swimmer).then((entry_events) => {
      console.log(entry_events);
      this.entry_events = entry_events;
    });
  }

  public enterMeet(meet :Meet) {
    this.navCtrl.push(MeetEntryPage, {
      meet: meet
    });
  }
}
