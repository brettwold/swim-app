import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Time }           from './time';
import { AsaService }     from '../../app/asa.service';
import { Swimmer }        from '../../models/swimmer';
import { SwimData }       from '../../app/swimdata.service';

@Component({
  selector: 'page-home',
  templateUrl: 'times.html'
})
export class TimesPage {
  errorMessage: string;
  swimmer: Swimmer;
  mode = 'Observable';
  config: any = {};

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private asaService: AsaService,
      private swimData: SwimData) {
            this.swimmer = this.params.get('swimmer');
            this.config = swimData;
  }

  getSwimmer(id) {
    this.asaService.getSwimmer(id)
                     .subscribe(
                       swimmer => this.swimmer = swimmer,
                       error =>  this.errorMessage = <any>error);
  }
}
