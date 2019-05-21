import { Injectable }     from '@angular/core';
import { Storage }        from '@ionic/storage';

import { DefaultSwimData }     from '../models/default.swimdata';

@Injectable()
export class SwimData {
  public static CONFIG_DATA_STORE :string = 'config_data';

  static readonly STROKE_LOOKUP :any = {
    'Free': 'FS',
    'Breast': 'BR',
    'Back': 'BK',
    'Fly': 'BF',
    'IM': 'IM',
  };

  private config_url;
  private static refresh = false;

  meet_types: Array<string>;
  levels: any;
  lanes: Array<string>;
  genders: Map<string, any>;
  gender_aliases: any;
  meet_age_types: Array<any>;
  entry_groups: any;
  group_aliases: any;
  record_groups: Map<string, any>;
  strokes: any;
  races: any;
  event_types: Array<any>;
  course_types: Array<any>;
  counties: any;
  regions: any;
  clubs: Map<string, any>;

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

  public getRaceType(course :string, distance :number, stroke :string) :any {
    for(let i in this.races) {
      let race = this.races[i];
      if(race.course_type == course && race.distance == distance && race.stroke == SwimData.STROKE_LOOKUP[stroke]) {
        return race;
      }
    }
    return null;
  }
}
