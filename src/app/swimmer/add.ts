import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TimesPage }          from '../times/times';
import { SwimmerEditPage }    from '../swimmer/swimmer';

import { Swimmer }            from '../models/swimmer';

import { SwimData }           from '../providers/swimdata';
import { AsaService }         from '../providers/asa.service';
import { SwimmersService }    from "../providers/swimmers";

import 'rxjs/Rx';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
  styleUrls: ['add.scss']
})
export class AddPage {

  errorMessage: string;
  asanum :string;
  showAddButton :boolean = true;

  constructor(
          public router: Router,
          private asaService: AsaService,
          private swimmersService: SwimmersService,
          private config: SwimData) {

  }

  public addSwimmer() {
    this.showAddButton = false;
    this.asaService.getSwimmer(this.asanum).subscribe((swimmer) => {
      if(swimmer) {
        this.swimmersService.setCurrentSwimmer(swimmer);
        this.router.navigateByUrl('/swimmer/edit');
      } else {
        this.showAddButton = true;
        this.errorMessage = "Unable to find swimmer. Please check ASA number and try again";
      }
    }, (error) => {
      console.log(error);
      this.showAddButton = true;
      this.errorMessage = "Unable to find swimmer. Please check ASA number and try again";
    });
  }

  public editSwimmer(swimmer: Swimmer) {
    this.swimmersService.setCurrentSwimmer(swimmer);
    this.router.navigateByUrl('/swimmer/edit');
  }

  public selectSwimmer(swimmer :Swimmer) {
    this.swimmersService.setCurrentSwimmer(swimmer);
    this.router.navigateByUrl('/times');
  }

  public removeSwimmers() {
    this.swimmersService.clear();
  }
}
