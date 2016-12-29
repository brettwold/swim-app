import { Injectable }     from '@angular/core';
import { Storage }        from '@ionic/storage';
import { Platform }       from 'ionic-angular';
import { Swimmer }        from '../models/swimmer';
import { SwimtimesService } from './swimtimes';

import { Subject }        from 'rxjs/Subject';
import 'rxjs/Rx';

const win: any = window;
const DB_NAME = 'data.db';

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
          console.log("Got swimmers: " + val);
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

  store(swimmer: Swimmer) {
    console.log("Storing swimmer: " + swimmer.regno);
    this.swimmers[swimmer.regno] = swimmer;
    this.storage.set(this.SWIMMERS_STORE, JSON.stringify(this.swimmers)).then((result) => {
      for(let sTime in swimmer.times) {
        swimmer.times[sTime].swimmer_regno = swimmer.regno;
        this.swimtimesService.save(swimmer.times[sTime]);
      }
      console.log("Stored swimmers: " + result);
      this.swimmersChange.next(this.swimmers);
    });
  }

  clear() {
    this.storage.remove(this.SWIMMERS_STORE);
    this.swimmers = {};
    this.swimmersChange.next(this.swimmers);
  }
}
