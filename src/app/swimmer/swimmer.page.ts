import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AsaService }       from '../providers/asa.service';
import { SwimData }         from '../providers/swimdata';
import { SwimmersService }  from '../providers/swimmers';

import { Swimmer }          from '../models/swimmer';

@Component({
  selector: 'swimmer',
  templateUrl: 'swimmer.page.html'
})
export class SwimmerEditPage {
  errorMessage: string;
  swimmer: Swimmer;
  mode = 'Observable';
  genders: Map<string, any>;
  showSaveButton :boolean = true;

  constructor(public router: Router, private asaService: AsaService, private swimData: SwimData, private swimmersService: SwimmersService) {
    this.swimmer = swimmersService.getCurrentSwimmer();
    this.genders = swimData.genders;
  }

  public save(swimmer: Swimmer) {
    console.log("Saving swimmer");
    this.showSaveButton = false;
    this.swimmersService.store(swimmer);
    this.router.navigateByUrl('/');
  }
}
