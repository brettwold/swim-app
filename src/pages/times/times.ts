import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Swimmer }        from '../../models/swimmer';

import { AsaService }     from '../../services/asa.service';
import { SwimData }       from '../../services/swimdata.service';

import { SwimtimesService }           from "../../providers/swimtimes";

@Component({
  selector: 'page-home',
  templateUrl: 'times.html'
})
export class TimesPage {
  errorMessage: string;
  swimmer: Swimmer;
  times: any;
  mode = 'Observable';
  config: any = {};

  constructor(public navCtrl: NavController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private asaService: AsaService,
      private swimData: SwimData,
      private swimtimesService: SwimtimesService) {
            this.swimmer = this.params.get('swimmer');
            console.log(this.swimmer);
            this.config = swimData;
  }

  getSwimmer(id) {
    this.asaService.getSwimmer(id)
                     .subscribe(
                       swimmer => this.swimmer = swimmer,
                       error =>  this.errorMessage = <any>error);
  }

  getAllTimes(race_type) {
    this.asaService.getSwimmerTimes(this.swimmer.regno, race_type)
                      .subscribe(
                          (times) => {
                            for(let sTime in times) {
                              this.swimtimesService.save(times[sTime]);
                            }
                          },
                          (error) =>  {
                            this.errorMessage = <any>error
                          });
  }
}
