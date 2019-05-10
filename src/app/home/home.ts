import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Storage } from '@ionic/storage';

import { TimesPage }          from '../times/times';
import { SwimmerEditPage }    from '../swimmer/swimmer';
import { AddPage }            from '../swimmer/add';

import { Swimmer }            from '../models/swimmer';

import { SwimData }           from '../providers/swimdata';
import { SwimmersService }    from "../providers/swimmers";

import { Subscription }       from 'rxjs/Subscription';
import 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss']
})
export class HomePage {

  errorMessage: string;
  asanum :string;
  swimmers :Array<Swimmer>;

  _subscription :Subscription;

  constructor(
          public router: Router,
          private swimmersService: SwimmersService,
          private config: SwimData,
        private storage: Storage) {
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

  public removeToken() {
    this.storage.remove('id_token');
  }

  public addSwimmer() {
    this.router.navigateByUrl('/swimmer/add');
  }

  public removeSwimmer(swimmer :Swimmer) {
    this.swimmersService.remove(swimmer);
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

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ngOnChanges(changes) {
      console.log(changes);
  }
}
