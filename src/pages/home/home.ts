import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { NavController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  swimmers :Array<any> = [];
  asanum :String;

  constructor(public navCtrl: NavController, private storage: Storage) {
    storage.get('swimmers').then((val) => {
      console.log("Got swimmers: " + val);
      if (val) {
        this.swimmers = JSON.parse(val);
      }
    });
  }

  public addSwimmer() {
    console.log("Adding swimmer: " + this.asanum);
    this.swimmers.push(this.asanum);
    this.storage.set("swimmers", JSON.stringify(this.swimmers));
  }

}
