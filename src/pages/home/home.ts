import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavController }      from 'ionic-angular';
import { TimesPage }          from '../../pages/times/times';
import { Swimmer }            from '../../models/swimmer';
import { AsaService }         from '../../app/asa.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  SWIMMERS_STORE :string = 'swimmers';

  errorMessage: string;
  swimmers :Array<any> = [];
  asanum :string;

  constructor(public navCtrl: NavController, private storage: Storage, private asaService: AsaService) {
    storage.get(this.SWIMMERS_STORE).then((val) => {
      console.log("Got swimmers: " + val);
      if (val) {
        this.swimmers = JSON.parse(val);
      }
    });
  }

  public addSwimmer() {
    this.asaService.getSwimmer(this.asanum).subscribe(
        swimmer => {
          let newSwimmer = new Swimmer(this.asanum);
          newSwimmer.setData(swimmer);
          console.log(newSwimmer);
          this.swimmers.push(newSwimmer);
          this.storage.set(this.SWIMMERS_STORE, JSON.stringify(this.swimmers));
        },
        error =>  this.errorMessage = <any>error);
  }

  public selectSwimmer(swimmer :Swimmer) {
      this.navCtrl.push(TimesPage, {
        swimmer: swimmer
      });
  }

  public removeSwimmers() {
    this.storage.remove(this.SWIMMERS_STORE);
    this.swimmers = [];
  }

}
