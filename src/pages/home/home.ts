import { Component } from '@angular/core';

import { NavController }      from 'ionic-angular';
import { TimesPage }          from '../../pages/times/times';
import { SwimmerEditPage }    from '../../pages/swimmer/swimmer';

import { Swimmer }            from '../../models/swimmer';

import { SwimData }           from '../../providers/swimdata';
import { AsaService }         from '../../providers/asa.service';
import { SwimmersService }    from "../../providers/swimmers";

import { Subscription }       from 'rxjs/Subscription';
import 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  inputs:['swimmers']
})
export class HomePage {

  errorMessage: string;
  asanum :string;
  swimmers :Array<Swimmer>;

  _subscription :Subscription;

  constructor(public navCtrl: NavController,
          private asaService: AsaService,
          private swimmersService: SwimmersService,
          private config: SwimData) {

    this.refresh();

    this._subscription = swimmersService.swimmersChange.subscribe((value) => {
      this.refreshSwimmers(value);
    });
  }

  public refreshSwimmers(swimmers) {
    this.swimmers = [];
    for(let regno in swimmers) {
      this.swimmers.push(swimmers[regno]);
    }
  }

  public refresh() {
    this.swimmersService.load().then((swimmers) => {
      this.refreshSwimmers(swimmers);
    });
  }

  public addSwimmer() {
    this.asaService.getSwimmer(this.asanum).subscribe((swimmer) => {
      this.swimmersService.store(swimmer);
    }, (error) => {
      this.errorMessage = <any>error
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

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ngOnChanges(changes) {
      console.log(changes);
  }
}
