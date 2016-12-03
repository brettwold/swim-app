import { Component } from '@angular/core';

import { NavController }      from 'ionic-angular';
import { TimesPage }          from '../../pages/times/times';
import { SwimmerEditPage }    from '../../pages/swimmer/swimmer';

import { Swimmer }            from '../../models/swimmer';

import { SwimData }           from '../../services/swimdata.service';
import { AsaService }         from '../../services/asa.service';
import { SwimmersService }    from '../../services/swimmers.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  errorMessage: string;
  asanum :string;
  swimmers :any;
  mode = 'Observable';
  config: any = {};

  constructor(public navCtrl: NavController,
          private asaService: AsaService,
          private swimmersService: SwimmersService,
          private swimData: SwimData) {
    swimmersService.load().then((swimmers) => {
      this.swimmers = swimmers;
      this.config = swimData;
    });
  }

  public addSwimmer() {
    this.asaService.getSwimmer(this.asanum).subscribe(
        swimmer => {
          let newSwimmer = new Swimmer(this.asanum);
          newSwimmer.setData(swimmer);
          this.swimmers = this.swimmersService.store(newSwimmer);
          console.log(this.swimmers);
        },
        error =>  this.errorMessage = <any>error);
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
    this.swimmers = this.swimmersService.clear();
  }

}
