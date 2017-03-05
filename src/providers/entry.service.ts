import { Injectable }       from '@angular/core';
import { Http, Response, Headers }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';

import { EnvService }       from './env.service';
import { HttpProvider }     from './http.provider';

import { Entry }            from '../models/entry';
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

    let payload = {
      entry: {
        meet_id: entry.meet.id,
        swimmer: entry.swimmer,
        entries: entry.entries,
        admin_fee: entry.admin_fee,
        cost_per_race: entry.cost_per_race
      }
    };

    return this.http
               .put(this.entry_save_url, payload)
               .map(res => this.extractEntry(res))
               .catch(this.handleError);
  }

  extractEntry(res: Response) {
    console.log(res);
  }

  getEntries(swimmer: Swimmer): Observable<Array<Entry>> {
    return this.http.get(this.entry_get_url)
                    .map(res => this.extractEntries(res))
                    .catch(this.handleError);
  }

  extractEntries(res: Response) {
      let body = res.json();
      let entries = new Array<Entry>();
      for(let indx in body.entries) {
        entries.push(new Entry(body.entries[indx]));
      }

      return entries;
  }

}
