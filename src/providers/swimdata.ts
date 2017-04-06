import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Storage }        from '@ionic/storage';

import { HttpProvider }   from './http.provider';
import { EnvService }     from './env.service';

import { DefaultSwimData }     from '../models/default.swimdata';

@Injectable()
export class SwimData extends HttpProvider {
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

  constructor (private storage: Storage, private http: Http, private env: EnvService) {
    super();
    this.config_url = env.getDataUrl() + 'swimdata';
    this.initialise();
  }

  initialise() {
    Object.assign(this, DefaultSwimData.DATA);
    this.storage.get(SwimData.CONFIG_DATA_STORE).then(data => {
      if(data) {
        Object.assign(this, data);
      }
    });

    if(!SwimData.refresh) {
      SwimData.refresh = true;
      console.log("Synchronise swimdata");
      this.getConfig().subscribe(
        data => this.extractData,
        error => this.handleError
      );
    }
  }

  getConfig() {
    return this.http.get(this.config_url)
                    .map(res => this.extractData(res))
                    .catch(this.handleError);
  }

  extractData(res: Response) {
    this.storage.set(SwimData.CONFIG_DATA_STORE, res.json()).then(data => {
      Object.assign(this, res.json());
    });
  }
}
