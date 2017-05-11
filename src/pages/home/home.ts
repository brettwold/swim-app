import { Component } from '@angular/core';

import { NavController }      from 'ionic-angular';
import { TimesPage }          from '../../pages/times/times';
import { SwimmerEditPage }    from '../../pages/swimmer/swimmer';
import { AddPage }            from '../../pages/swimmer/add';

import { Swimmer }            from '../../models/swimmer';
import { User }               from '../../models/user';

import { SwimData }           from '../../providers/swimdata';
import { AsaService }         from '../../providers/asa.service';
import { SwimmersService }    from "../../providers/swimmers";
import { UserService }        from "../../providers/user";
import { Storage } from '@ionic/storage';

import { Subscription }       from 'rxjs/Subscription';
import 'rxjs/Rx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  errorMessage: string;
  asanum :string;
  swimmers :Array<Swimmer>;
  user :User;

  _subscription :Subscription;

  constructor(
          public navCtrl: NavController,
          private asaService: AsaService,
          private swimmersService: SwimmersService,
          private config: SwimData,
          private userService: UserService,
        private storage: Storage) {
    this.refresh();

// TODO - implement user signup later
    // userService.load().then((user) => {
    //   if(user) {
    //     this.user = user;
    //   } else {
    //     this.user = null;
    //   }
    // });

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

  public logout() {
    this.userService.clear();
    //this.navCtrl.setRoot(SignupPage);
  }

  public addSwimmer() {
    this.navCtrl.push(AddPage);
  }

  public removeSwimmer(swimmer :Swimmer) {
    this.swimmersService.remove(swimmer);
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
