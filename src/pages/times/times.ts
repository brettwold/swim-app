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
            for(let time of this.swimmer.times) {
              time.conv = this.getConvertedTime(time);
            }
  }

  public getConvertedTime(time): number {
    let timeinsecs: number = time.time/100;
    let race = this.config.races[time.race_type];
    let distPerHund = race.distance/100;
    let numbTurnFactor = distPerHund*distPerHund*2;
    let turnFactor = this.config.turn_factors[time.race_type];
    console.log(race.distance + " " + numbTurnFactor);
    if (turnFactor) {
      if (time.race_type > 200) {
        return (timeinsecs - ((turnFactor / timeinsecs) * numbTurnFactor))*100;
      } else {
        let roots = this.solveQuadraticEquation(1, -1*timeinsecs, -1*turnFactor*numbTurnFactor);
        return roots[1] * 100;
      }
    }
  }

  solveQuadraticEquation(a: number, b: number, c: number): Array<number> {
    let d: number = b * b - 4 * a * c;
    let ds: number;
    let mbmds: number;
    let mbpds: number;

    if (a === 0) {
      if (b === 0) {
        if (c === 0) {
          return [0, 0, 0];
        } else {
          return [];
        }
      } else {
        return [-c / b];
      }
    }

    if (d < 0) {
      return [];
    } else if (d === 0) {
      return [-b / (2 * a)];
    }

    ds = Math.sqrt(d);
    if (b >= 0) {
      mbmds = -b - ds;
      return [mbmds / (2 * a), 2 * c / mbmds];
    } else {
      mbpds = -b + ds;
      return [2 * c / mbpds, mbpds / (2 * a)];
    }
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
