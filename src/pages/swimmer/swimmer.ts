import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AsaService }       from '../../providers/asa.service';
import { SwimData }         from '../../providers/swimdata';
import { SwimmersService }  from '../../providers/swimmers';

import { Swimmer }          from '../../models/swimmer';

@Component({
  selector: 'swimmer',
  templateUrl: 'swimmer.html'
})
export class SwimmerEditPage {
  errorMessage: string;
  swimmer: Swimmer;
  mode = 'Observable';
  config: any = {};
  genders: Array<any> = new Array();
  showSaveButton :boolean = true;

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private asaService: AsaService,
      private swimData: SwimData,
      private swimmersService: SwimmersService) {
            this.swimmer = this.params.get('swimmer');
            this.config = swimData;

            for(let gender in this.config.genders) {
              this.genders.push({code: gender, name: this.config.genders[gender] });
            }
  }

  public save(swimmer: Swimmer) {
    console.log("Saving swimmer");
    this.showSaveButton = false;
    this.swimmersService.store(swimmer);
    this.navCtrl.popToRoot();
  }
}
