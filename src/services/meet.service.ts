import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { SwimData }       from './swimdata.service';
import { TimeUtils }      from './timeutils.service';
import { Meet }           from '../models/meet';

@Injectable()
export class MeetService {

  private MEETS = '/api/meets';

  constructor (private http: Http, private swimData: SwimData, private timeUtils: TimeUtils) {

  }

  getMeets(): Observable<Array<Meet>> {
    let url = this.MEETS;
    return this.http.get(url)
                    .map(res => this.extractData(res))
                    .catch(this.handleError);
  }

  extractData(res :Response) {

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
