import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Swimmer }        from '../../models/swimmer';

import { AsaService }     from '../../services/asa.service';
import { SwimData }       from '../../services/swimdata.service';

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
