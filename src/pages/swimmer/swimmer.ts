import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AsaService }     from '../../services/asa.service';
import { SwimData }       from '../../services/swimdata.service';
import { SwimmersService }       from '../../providers/swimmers';

import { Swimmer }        from '../../models/swimmer';

@Component({
  selector: 'swimmer',
  templateUrl: 'swimmer.html'
})
export class SwimmerEditPage {
  errorMessage: string;
  swimmer: Swimmer;
  mode = 'Observable';
  config: any = {};

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private asaService: AsaService,
      private swimData: SwimData,
      private swimmersService: SwimmersService) {
            this.swimmer = this.params.get('swimmer');
            this.config = swimData;
  }

  public save(swimmer: Swimmer) {
    console.log("Saving swimmer");
    this.swimmersService.store(swimmer);
    this.navCtrl.pop();
  }
}
