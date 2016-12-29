import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Platform }       from 'ionic-angular';
import { Observable }     from 'rxjs/Observable';
import { SwimData }       from './swimdata.service';
import { Swimmer }        from '../models/swimmer';
import { SwimTime }        from '../models/swimtime';

import * as moment from 'moment';

//const platform = new Platform();
//if(this.platform.is('core')) {
//  const ENV = require('../config/environment.dev');
//} else {
  //import { ENV }            from '../config/environment.prod';
  import { ENV }            from '../config/environment.dev';
//}

//import 'moment';
import 'rxjs/Rx';

declare var jQuery:any;

@Injectable()
export class AsaService {
  private INDIVIDUAL_BEST = 'individualbest/personal_best.php?mode=A&tiref=';
  private STROKE_HISTORY = 'individualbest/personal_best_time_date.php?mode=A&tiref='
  private ATTR_STOKE_TYPE = '&tstroke='
  private ATTR_COURSE_TYPE = '&tcourse='
  private STROKE_LOOKUP = {
    'Freestyle': 'FS',
    'Breaststroke': 'BR',
    'Backstroke': 'BK',
    'Butterfly': 'BF',
    'Individual': 'IM',
  };

  constructor (private http: Http, private swimData: SwimData) {
    console.log( ENV.ASA_URL );
  }

  getSwimmer (id): Observable<Swimmer> {
    let url = ENV.ASA_URL + this.INDIVIDUAL_BEST + id;
    console.log( url );
    return this.http.get(url)
                    .map(res => this.extractData(res))
                    .catch(this.handleError);
  }

  getSwimmerTimes (id, race_type): Observable<SwimTime>  {
    let asaStroke = this.getAsaStrokeCode(race_type);
    let asaCourse = this.getAsaCourseCode(race_type);
    let url = ENV.ASA_URL + this.STROKE_HISTORY + id + this.ATTR_STOKE_TYPE + asaStroke + this.ATTR_COURSE_TYPE + asaCourse;

    return this.http.get(url)
                    .map(res => this.extractTimes(id, race_type, res))
                    .catch(this.handleError);
  }

  private removeBrackets (str): String {
    return str.replace(/\(|\)/g,'');
  }

  private getFirstName (str): String {
    return str.split(' ').slice(0, -1).join(' ');
  }

  private getLastName (str): String {
    return str.split(' ').slice(-1).join(' ');
  }

  private removeExtraWhitespace (str): String {
    return str.replace(/\s{2,}/g, ' ').trim();
  }

  private formatDate (str): string {
    return moment(str, 'DD/MM/YY').format('YYYY-MM-DD');
  }

  private processName (data :any, str :any) {
    let namesArr = str.split(" - ");

    if(namesArr.length == 3) {
      let name = this.removeExtraWhitespace(namesArr[0]);
      data.first_name = this.getFirstName(name);
      data.last_name = this.getLastName(name);
      data.regno = this.removeBrackets(namesArr[1]);
      data.club = namesArr[2];
    } else {
      data.last_name = str;
    }
  }

  private processDistanceAndStroke(data, course_type, str) {
    let strokeArr = str.split(" ");

    if(strokeArr.length >= 2) {
      for(let idx in this.swimData.races) {
        let race = this.swimData.races[idx];
        if(race.distance == strokeArr[0] &&
          race.stroke == this.STROKE_LOOKUP[strokeArr[1]] &&
          race.course_type == course_type) {
          data.race_type = idx;
        }
      }
    }
  }

  private processBestTimeTables(dom, swimmer) {
    let self = this;
    swimmer.times = [];

    dom.find('#rankTable').each(function(rankTableIndex, rankTable) {
      jQuery(rankTable).find('tr').each(function(i, row) {
        let time = new SwimTime();
        let selectcol = jQuery(row).find('td');
        let course_type = "LC";

        if(jQuery(rankTable).prev('p').text().indexOf('Short') > -1) {
          course_type = "SC";
        }

        if(selectcol.eq(0).text() != "") {
          self.processDistanceAndStroke(time, course_type, selectcol.eq(0).text().trim());
          if(selectcol.eq(0).children()[0].tagName == 'A') {
            time.more = true;
          } else {
            time.more = false;
          }
          time.source = "ASA";
          time.setFormattedTime(selectcol.eq(1).text().trim());
          time.fina_points = selectcol.eq(2).text().trim();
          time.date = self.formatDate(selectcol.eq(3).text().trim());
          time.meet_name = selectcol.eq(4).text().trim();
          time.venue = selectcol.eq(5).text().trim();
          time.license = selectcol.eq(6).text().trim();
          time.level = selectcol.eq(7).text().trim();
          time.round = 'U';
          swimmer.times.push(time);
        }
      });
    });
  }

  private processAllTimeTables(dom, times, regno, race_type) {
    let self = this;

    dom.find('#rankTable').first().find('tr').each(function(i, row) {
        let time = new SwimTime();
        let selectcol = jQuery(row).find('td');

        if(selectcol.eq(0).text() != "") {
          time.swimmer_regno = regno;
          time.race_type = race_type;
          time.source = "ASA";
          time.setFormattedTime(selectcol.eq(0).text().trim());
          time.fina_points = selectcol.eq(1).text().trim();
          time.date = self.formatDate(selectcol.eq(3).text().trim());
          time.meet_name = selectcol.eq(4).text().trim();
          time.venue = selectcol.eq(5).text().trim();
          time.license = selectcol.eq(6).text().trim();
          time.level = selectcol.eq(7).text().trim();
          time.round = selectcol.eq(2).text().trim();
          times.push(time);
        }
      });

  }

  private getAsaStrokeCode(race_type) {
    return this.swimData.races[race_type].asa_stroke
  }

  private getAsaCourseCode(race_type) {
    return this.swimData.races[race_type].asa_course
  }

  private extractData(res :Response) {
    let dom = jQuery(res.text());
    let swimmer :any = {};
    let names = dom.find('.rankingsContent p').first().text();
    this.processName(swimmer, names);
    this.processBestTimeTables(dom, swimmer);

    let newSwimmer = new Swimmer(swimmer);
    return newSwimmer;
  }

  private extractTimes(regno: string, race_type: number, res: Response) {
    let dom = jQuery(res.text());
    let times: Array<SwimTime> = new Array();

    this.processAllTimeTables(dom, times, regno, race_type);

    return times;
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
