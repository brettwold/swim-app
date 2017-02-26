import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { HistoryPage }        from '../../pages/times/history';

import { Swimmer }            from '../../models/swimmer';

import { AsaService }         from '../../providers/asa.service';
import { SwimData }           from '../../providers/swimdata';
import { SwimtimesService }   from "../../providers/swimtimes";

@Component({
  selector: 'page-times',
  templateUrl: 'times.html'
})
export class TimesPage {

  course: string = 'SC';
  swimmer: Swimmer;
  mode = 'Observable';

  constructor(public navCtrl: NavController,
      public toastCtrl: ToastController,
      public params: NavParams,
      public viewCtrl: ViewController,
      private asaService: AsaService,
      public config: SwimData,
      private swimtimesService: SwimtimesService) {
            this.swimmer = this.params.get('swimmer');
            console.log(this.swimmer);
  }

  getSwimmer(id) {
    this.asaService.getSwimmer(id).subscribe(swimmer => {
      this.swimmer = swimmer;
    }, error =>  {
      console.log(error);
      let toast = this.toastCtrl.create({
       message: "Unable to get swimmer information at this time. Please try again later",
       showCloseButton: true,
       closeButtonText: 'OK'
      });
      toast.present();
    });
  }

  refresh() {
    this.getSwimmer(this.swimmer.regno);
  }

  getAllTimes(race_type) {
    this.asaService.getSwimmerTimes(this.swimmer.regno, race_type).subscribe((times) => {
      for(let sTime in times) {
        this.swimtimesService.save(times[sTime]);
      }
      this.navCtrl.push(HistoryPage, {
        swimmer: this.swimmer,
        times: times
      });
    }, (error) =>  {
      console.log(error);
      let toast = this.toastCtrl.create({
       message: "Unable to get swimmer time information at this time. Please try again later",
       showCloseButton: true,
       closeButtonText: 'OK'
      });
      toast.present();
    });
  }
}
