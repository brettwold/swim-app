import { Injectable }       from '@angular/core';
import { Http, Response, Headers }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';

import { EnvService }       from './env.service';
import { HttpProvider }     from './http.provider';

import { Entry }             from '../models/entry';
import { Swimmer }          from '../models/swimmer';

@Injectable()
export class EntryService extends HttpProvider {

  private entry_save_url: string;
  private entry_get_url: string;

  constructor (private http: Http, private env: EnvService){
    super();
    this.entry_save_url = env.getDataUrl() + 'entries/save';
  }

  sendEntry(entry: Entry): Observable<Entry>  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
               .put(this.entry_save_url, JSON.stringify(entry), { headers: headers })
               .map(res => res.json());
  }

  getEntries(swimmer: Swimmer): Observable<Array<Entry>> {
    console.log("Getting meets from: " + this.entry_get_url);
    return this.http.get(this.entry_get_url)
                    .map(res => this.extractData(res))
                    .catch(this.handleError);
  }

  extractData(res :Response) {
      let body = res.json();
      let entries = new Array<Entry>();
      for(let indx in body.entries) {
        entries.push(new Entry(body.entries[indx]));
      }

      return entries;
  }

}
