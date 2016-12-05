import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { SwimData }       from './swimdata.service';
import { TimeUtils }      from './timeutils.service';
import { Swimmer }        from '../models/swimmer';

//import 'moment';
import 'rxjs/Rx';

declare var jQuery:any;

@Injectable()
export class AsaService {
  private INDIVIDUAL_BEST = '/asa/individualbest/personal_best.php?mode=A&tiref=';
  private STROKE_LOOKUP = {
    'Freestyle': 'FS',
    'Breaststroke': 'BR',
    'Backstroke': 'BK',
    'Butterfly': 'BF',
    'Individual': 'IM',
  };

  constructor (private http: Http, private swimData: SwimData, private timeUtils: TimeUtils) {

  }

  getSwimmer (id): Observable<Swimmer> {
    let url = this.INDIVIDUAL_BEST + id;
    return this.http.get(url)
                    .map(res => this.extractData(res))
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

  private formatDate (str): String {
    return str;//moment(str, 'DD/MM/YY').format('YYYY-MM-DD');
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

  private processDistanceAndStroke(data, str) {
    let strokeArr = str.split(" ");

    if(strokeArr.length >= 2) {
      for(let idx in this.swimData.races) {
        let race = this.swimData.races[idx];
        if(race.distance == strokeArr[0] &&
          race.stroke == this.STROKE_LOOKUP[strokeArr[1]] &&
          race.course_type == data.course_type) {
          data.race_type = idx;
        }
      }
    }
  }

  private processBestTimeTables(dom, swimmer) {
    swimmer.times = [];
    let self = this;

    dom.find('#rankTable').each(function(rankTableIndex, rankTable) {
      jQuery(rankTable).find('tr').each(function(i, row) {
        let time :any = {};
        let selectcol = jQuery(row).find('td');
        let course_type = "LC";

        if(jQuery(rankTable).prev('p').text().indexOf('Short') > -1) {
          course_type = "SC";
        }

        if(selectcol.eq(0).text() != "") {
          time.course_type = course_type;
          self.processDistanceAndStroke(time, selectcol.eq(0).text().trim());
          time.source = "ASA";
          time.time_formatted = selectcol.eq(1).text().trim();
          time.time = self.timeUtils.getHundredthsFromString(time.time_formatted);
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

  private processAllTimeTables($, swimmer) {
    $('#rankTable').each(function(rankTableIndex, rankTable) {
      $(rankTable).find('tr').each(function(i, row) {
        let time :any = {};
        let selectcol = $(row).find('td');

        if(selectcol.eq(0).text() != "") {
          time.source = "ASA";
          time.time_formatted = selectcol.eq(0).text().trim();
          time.fina_points = selectcol.eq(1).text().trim();
          time.date = this.formatDate(selectcol.eq(3).text().trim());
          time.meet_name = selectcol.eq(4).text().trim();
          time.venue = selectcol.eq(5).text().trim();
          time.license = selectcol.eq(6).text().trim();
          time.level = selectcol.eq(7).text().trim();
          time.round = selectcol.eq(2).text().trim();
          swimmer.times.push(time);
        }
      });
    });
  }

  private getAsaStrokeCode(stroke_type) {
    return this.swimData.races[stroke_type].asa_stroke
  }

  private getAsaCourseCode(stroke_type) {
    return this.swimData.races[stroke_type].asa_course
  }

  private extractData(res :Response) {

    let body = res.text();
    let dom = jQuery(res.text());

    let swimmer :any = {};
    let names = dom.find('.rankingsContent p').first().text();
    this.processName(swimmer, names);
    this.processBestTimeTables(dom, swimmer);

    let newSwimmer = new Swimmer(swimmer.regno);
    newSwimmer.setData(swimmer);
    return newSwimmer;
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
