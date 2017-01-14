import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { MeetEntryPage }    from './meetentry.ts'

import { Meet }             from '../../models/meet';
import { Swimmer }          from '../../models/swimmer';

import { MeetService }      from '../../providers/meet.service';
import { SwimmersService }  from '../../providers/swimmers';
import { SwimData }         from '../../providers/swimdata';

@Component({
  selector: 'page-home',
  templateUrl: 'meetdetail.html'
})
export class MeetDetailPage {
  errorMessage: string;
  swimmers: any;
  swimmersList: Array<Swimmer>;
  meet: Meet;
  swimmerRegno: string;
  swimmer: Swimmer;
  entryEvents: any;
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
      this.swimmersList = [];

      for(let regno in swimmers) {
        this.swimmersList.push(swimmers[regno]);
      }

      if(this.swimmersList.length == 1) {
        this.swimmerRegno = this.swimmersList[0].regno;
        this.selectSwimmer();
      }
    });
  }

  public ageAtMeet() {
    return this.meetService.ageAtMeet(this.swimmer, this.meet);
  }

  public getGroupForSwimmer() :string {
    return this.meetService.getGroupForSwimmer(this.swimmer, this.meet).description;
  }

  public selectSwimmer() {
    this.swimmer = new Swimmer(this.swimmers[this.swimmerRegno]);

    this.meetService.getEntryEvents(this.swimmer, this.meet).then((entryEvents) => {
      this.entryEvents = entryEvents;
    });
  }

  public confirmEntries() {
    let entries :Array<any> = new Array();
    for(let evt in this.entryEvents) {
      if(this.entryEvents[evt].entered) {
        entries.push(this.entryEvents[evt]);
      }
    }

    this.navCtrl.push(MeetEntryPage, {
      meet: this.meet,
      swimmer: this.swimmer,
      entries: entries
    });
  }
}
