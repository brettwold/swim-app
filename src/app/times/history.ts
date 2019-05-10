import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastController }  from '@ionic/angular';

import { Swimmer }          from '../models/swimmer';
import { SwimTime }         from '../models/swimtime';

import { AsaService }         from '../providers/asa.service';
import { SwimData }           from '../providers/swimdata';
import { SwimmersService }    from '../providers/swimmers';
import { SwimtimesService }   from "../providers/swimtimes";

@Component({
  selector: 'page-times',
  templateUrl: 'history.html',
  styleUrls: ['times.scss']
})
export class HistoryPage {
  errorMessage: string;
  swimmer: Swimmer;
  times: any;
  race_type: any;
  mode = 'Observable';

  private sub: any;

  constructor(private router: Router,
      private route: ActivatedRoute,
      public toastCtrl: ToastController,
      private asaService: AsaService,
      private config: SwimData,
      private swimmerService: SwimmersService,
      private swimtimesService: SwimtimesService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       const race_type_id = +params['race_type'];
       this.race_type = this.config.races[race_type_id];
       this.swimmer = this.swimmerService.getCurrentSwimmer();

       this.asaService.getSwimmerTimes(this.swimmer.regno, race_type_id).subscribe((times) => {
         this.times = times;
         this.saveTimes(times);
       }, (error) =>  {
         console.log(error);
         this.presentFailToast();
       });
    });
  }

  saveTimes(times :Array<SwimTime>) {
    for(let sTime in times) {
      this.swimtimesService.save(times[sTime]);
    }
  }

  async presentFailToast() {
    const toast = await this.toastCtrl.create({
     message: "Unable to get swimmer time information at this time. Please try again later",
     showCloseButton: true,
     closeButtonText: 'OK'
    });
    toast.present();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
