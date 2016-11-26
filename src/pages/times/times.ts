import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Time }           from './time';
import { AsaService }     from './asa.service';
import { SwimData }       from './swimdata.service';

@Component({
  selector: 'page-home',
  templateUrl: 'times.html'
})
export class TimesPage {
  errorMessage: string;
  swimmer: any = {};
  mode = 'Observable';
  config: any = {};

  constructor(public navCtrl: NavController,
      private asaService: AsaService,
      private swimData: SwimData) {
    this.getTimes(939148);
    this.config = swimData;
  }

  getTimes(id) {
    this.asaService.getTimes(id)
                     .subscribe(
                       swimmer => this.swimmer = swimmer,
                       error =>  this.errorMessage = <any>error);
  }
}
