import { Injectable }     from '@angular/core';
import { Storage }        from '@ionic/storage';
import { SQLite }         from 'ionic-native';
import { Platform }       from 'ionic-angular';
import { Swimmer }        from '../models/swimmer';

import { Subject }        from 'rxjs/Subject';
import 'rxjs/Rx';

const win: any = window;
const DB_NAME = 'data.db';

@Injectable()
export class SwimmersService {
  SWIMMERS_STORE :string = 'swimmers';

  db :any;

  swimmers :any = {};
  swimmersChange: Subject<any> = new Subject<any>();

  constructor(private storage :Storage, private platform :Platform) {
    platform.ready().then(() => {
      console.log(platform);
      if (!true) {
        this.db = new SQLite();
        this.db.openDatabase({ name: DB_NAME, location: 'default' }).then(() => {
          this.createTables();
        });
      } else {
        console.log("BROOOOOOWWWSSER");
        this.db = win.openDatabase(DB_NAME, "1.0", "SwimApp", -1);
        console.log(this.db);
        this.createTables();
      }
    });
  }

  query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            this.db.transaction((tx: any) => {
                    tx.executeSql(query, params,
                        (tx: any, res: any) => resolve({ tx: tx, res: res }),
                        (tx: any, err: any) => reject({ tx: tx, err: err }));
                },
                (err: any) => reject({ err: err }));
        } catch (err) {
            reject({ err: err });
        }
    });
}

  createTables() {
    this.query('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text)').catch(err => {
        console.error('Storage: Unable to create initial storage tables');
        console.error(err);
    });
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
