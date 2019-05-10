import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastController }  from '@ionic/angular';

import { Swimmer }          from '../models/swimmer';
import { SwimTime }         from '../models/swimtime';

import { AsaService }       from '../providers/asa.service';
import { SwimData }         from '../providers/swimdata';
import { SwimmersService }  from "../providers/swimmers";
import { SwimtimesService } from "../providers/swimtimes";

@Component({
  selector: 'page-times',
  templateUrl: 'times.html',
  styleUrls: ['times.scss']
})
export class TimesPage {

  course: string = 'SC';
  swimmer: Swimmer;
  mode = 'Observable';

  constructor(public router: Router,
      public toastCtrl: ToastController,
      private asaService: AsaService,
      public config: SwimData,
      private swimmersService: SwimmersService,
      private swimtimesService: SwimtimesService) {
            this.swimmer = this.swimmersService.getCurrentSwimmer();
  }

  ngOnInit() {
    console.log("Refreshing times");
    this.refresh();
  }

  getSwimmer(id) {
    this.asaService.getSwimmer(id).subscribe(swimmer => {
      this.swimmer.times = swimmer.times;
      this.swimmersService.store(this.swimmer);
      this.saveTimes(swimmer.times);
    }, error =>  {
      console.log(error);
      this.presentFailToast();
    });
  }

  saveTimes(times :Array<SwimTime>) {
    for(let sTime in times) {
      this.swimtimesService.save(times[sTime]);
    }
  }

  refresh() {
    this.getSwimmer(this.swimmer.regno);
  }

  getAllTimes(race_type) {
    this.router.navigateByUrl('/times/history/' + race_type);
  }

  async presentFailToast() {
    const toast = await this.toastCtrl.create({
     message: "Unable to get swimmer time information at this time. Please try again later",
     showCloseButton: true,
     closeButtonText: 'OK'
    });
    toast.present();
  }
}
