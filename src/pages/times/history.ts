import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Swimmer }            from '../../models/swimmer';

import { AsaService }         from '../../providers/asa.service';
import { SwimData }           from '../../providers/swimdata';
import { SwimtimesService }   from "../../providers/swimtimes";

@Component({
  selector: 'page-home',
  templateUrl: 'history.html'
})
export class HistoryPage {
  errorMessage: string;
  swimmer: Swimmer;
  times: any;
  race_type: any;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private asaService: AsaService,
      public config: SwimData,
      private swimtimesService: SwimtimesService) {
            this.swimmer = this.params.get('swimmer');
            this.times = this.params.get('times');
            this.race_type = config.races[this.times[0].race_type];
  }
}
