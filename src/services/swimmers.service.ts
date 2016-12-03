import { Injectable }     from '@angular/core';
import { Storage }        from '@ionic/storage';
import { Swimmer }        from '../models/swimmer';

@Injectable()
export class SwimmersService {
  SWIMMERS_STORE :string = 'swimmers';

  swimmers :any = {};

  constructor(private storage: Storage) {

  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get(this.SWIMMERS_STORE).then((val) => {
        console.log("Got swimmers: " + val);
        if (val) {
          this.swimmers = JSON.parse(val);
          resolve(this.swimmers);
        } else {
          reject("Failed to load swimmers");
        }
      });
    });
  }

  store(swimmer: Swimmer) {
    console.log("Storing swimmer: " + swimmer.asa_num);
    this.swimmers[swimmer.asa_num] = swimmer;
    this.storage.set(this.SWIMMERS_STORE, JSON.stringify(this.swimmers));
    return this.swimmers;
  }

  clear() {
    this.storage.remove(this.SWIMMERS_STORE);
    this.swimmers = {};
    return this.swimmers;
  }
}
