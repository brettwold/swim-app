import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AsaService }       from '../providers/asa.service';
import { SwimData }         from '../providers/swimdata';
import { SwimmersService }  from '../providers/swimmers';

import { Swimmer }          from '../models/swimmer';

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

  constructor(public router: Router,
      private asaService: AsaService,
      private swimData: SwimData,
      private swimmersService: SwimmersService) {
            this.swimmer = swimmersService.getCurrentSwimmer();
            this.config = swimData;

            for(let gender in this.config.genders) {
              this.genders.push({code: gender, name: this.config.genders[gender] });
            }
  }

  public save(swimmer: Swimmer) {
    console.log("Saving swimmer");
    this.showSaveButton = false;
    this.swimmersService.store(swimmer);
    this.router.navigateByUrl('/');
  }
}
