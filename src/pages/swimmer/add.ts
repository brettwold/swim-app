import { Component } from '@angular/core';

import { NavController }      from 'ionic-angular';
import { TimesPage }          from '../../pages/times/times';
import { SwimmerEditPage }    from '../../pages/swimmer/swimmer';

import { Swimmer }            from '../../models/swimmer';

import { SwimData }           from '../../providers/swimdata';
import { AsaService }         from '../../providers/asa.service';
import { SwimmersService }    from "../../providers/swimmers";
import { UserService }        from "../../providers/user";

import 'rxjs/Rx';

@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {

  errorMessage: string;
  asanum :string;
  showAddButton :boolean = true;

  constructor(
          public navCtrl: NavController,
          private asaService: AsaService,
          private swimmersService: SwimmersService,
          private config: SwimData,
          private userService: UserService) {

  }

  public addSwimmer() {
    this.showAddButton = false;
    this.asaService.getSwimmer(this.asanum).subscribe((swimmer) => {
      if(swimmer) {
        this.navCtrl.push(SwimmerEditPage, { swimmer: swimmer });
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
    this.navCtrl.push(SwimmerEditPage, {
      swimmer: swimmer
    });
  }

  public selectSwimmer(swimmer :Swimmer) {
    this.navCtrl.push(TimesPage, {
      swimmer: swimmer
    });
  }

  public removeSwimmers() {
    this.swimmersService.clear();
  }

}
