import { Injectable }     from '@angular/core';
import { Response }       from '@angular/http';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class HttpProvider {

  constructor() {

  }

  protected handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      if(error.status == 401) {
        console.log("We need to refresh auth token");

      }
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(error);
    return Observable.throw(errMsg);
  }
}
