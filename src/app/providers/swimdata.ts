import { Injectable }     from '@angular/core';
import { Storage }        from '@ionic/storage';

import { DefaultSwimData }     from '../models/default.swimdata';

@Injectable()
export class SwimData {
  public static CONFIG_DATA_STORE :string = 'config_data';

  private config_url;
  private static refresh = false;

  meet_types: Array<string>;
  levels: any;
  lanes: Array<string>;
  genders: any;
  gender_aliases: any;
  meet_age_types: Array<any>;
  entry_groups: any;
  group_aliases: any;
  strokes: any;
  races: any;
  event_types: Array<any>;
  course_types: Array<any>;
  counties: any;
  regions: any;

  constructor (private storage: Storage) {
    this.initialise();
  }

  initialise() {
    Object.assign(this, DefaultSwimData.DATA);
    this.storage.get(SwimData.CONFIG_DATA_STORE).then(data => {
      if(data) {
        Object.assign(this, data);
      }
    });
  }

  extractData(res: Response) {
    this.storage.set(SwimData.CONFIG_DATA_STORE, res.json()).then(data => {
      Object.assign(this, res.json());
    });
  }
}
