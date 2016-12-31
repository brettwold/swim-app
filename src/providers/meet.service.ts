import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { EnvService }     from './env.service';
import { SwimData }       from './swimdata.service';
import { TimeUtils }      from './timeutils.service';

import { Meet }           from '../models/meet';

@Injectable()
export class MeetService {

  private meets_url;

  constructor (private http: Http, private env: EnvService, private swimData: SwimData, private timeUtils: TimeUtils) {
    this.meets_url = env.getDataUrl() + 'meets';
  }

  getMeets(): Observable<Array<Meet>> {
    return this.http.get(this.meets_url)
                    .map(res => this.extractData(res))
                    .catch(this.handleError);
  }

  extractData(res :Response) {
      let body = res.json();
      let meets = new Array<Meet>();
      for(let indx in body) {
        meets.push(new Meet(body[indx]));
      }

      return meets;
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
