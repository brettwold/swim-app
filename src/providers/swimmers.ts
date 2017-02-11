import { Injectable }     from '@angular/core';
import { Storage }        from '@ionic/storage';
import { Platform }       from 'ionic-angular';
import { Swimmer }        from '../models/swimmer';
import { SwimtimesService } from './swimtimes';

import { Subject }        from 'rxjs/Subject';
import 'rxjs/Rx';

@Injectable()
export class SwimmersService {
  SWIMMERS_STORE :string = 'swimmers';

  swimmers :any = {};
  swimmersChange: Subject<any> = new Subject<any>();

  constructor(private storage :Storage, private platform :Platform, private swimtimesService: SwimtimesService) {

  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        this.storage.get(this.SWIMMERS_STORE).then((val) => {
          if (val) {
            this.swimmers = JSON.parse(val);
            resolve(this.swimmers);
          } else {
            resolve({});
          }
        });
      });
    });
  }

  remove(swimmer: Swimmer) {
    delete this.swimmers[swimmer.regno];
    this.updateSwimmers();
  }

  store(swimmer: Swimmer) {
    this.swimmers[swimmer.regno] = swimmer;
    for(let sTime in swimmer.times) {
      swimmer.times[sTime].swimmer_regno = swimmer.regno;
      this.swimtimesService.save(swimmer.times[sTime]);
    }
    this.updateSwimmers();
  }

  updateSwimmers() {
    this.storage.set(this.SWIMMERS_STORE, JSON.stringify(this.swimmers)).then((result) => {
      this.swimmersChange.next(this.swimmers);
    });
  }

  clear() {
    this.storage.remove(this.SWIMMERS_STORE);
    this.swimmers = {};
    this.swimmersChange.next(this.swimmers);
  }
}
