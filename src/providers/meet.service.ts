import { Injectable }       from '@angular/core';
import { Http, Response }   from '@angular/http';
import { Observable }       from 'rxjs/Observable';

import { EnvService }       from './env.service';
import { SwimData }         from './swimdata';
import { SwimtimesService } from './swimtimes';
import { HttpProvider }     from './http.provider';
import { TimeUtils }        from './timeutils.service';

import { Meet }             from '../models/meet';
import { Swimmer }          from '../models/swimmer';

import * as moment          from 'moment';


@Injectable()
export class MeetService extends HttpProvider {

  private meets_url;

  constructor (private http: Http, private env: EnvService, private swimData :SwimData,
      private timeUtils :TimeUtils, private swimtimesService :SwimtimesService) {
    super();
    this.meets_url = env.getDataUrl() + 'meets';
  }

  getMeets(): Observable<Array<Meet>> {
    console.log("Getting meets from: " + this.meets_url);
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

  public ageAtMeet(swimmer :Swimmer, meet :Meet) :number {
    if (!meet || !swimmer || !swimmer.dob || !meet.meet_date) {
      return 0;
    }
    let dob = moment(swimmer.dob, "YYYY-MM-DD");

    if (meet.age_type == 'AOD') {
      let endDecDate = moment(meet.meet_date, "YYYY-MM-DD");
      endDecDate.date(31);
      endDecDate.month(11);
      let duration = moment.duration(endDecDate.diff(dob));
      return Math.floor(duration.asYears());
    } else if (meet.age_type == 'AOE') {
      let now = moment();
      let duration = moment.duration(now.diff(dob));
      return Math.floor(duration.asYears());
    } else {
      let meetDate = moment(meet.meet_date, "YYYY-MM-DD");
      let duration = moment.duration(meetDate.diff(dob));
      return Math.floor(duration.asYears());
    }
  }

  public getGroupForSwimmer(swimmer :Swimmer, meet :Meet) :any {
    let aam = this.ageAtMeet(swimmer, meet);
    if (aam && meet.entry_groups_arr) {
      for(let i = 0; i < meet.entry_groups_arr.length; i++) {
        let entryGroup = this.swimData.entry_groups[meet.entry_groups_arr[i]];
        if(aam >= entryGroup.min && aam < entryGroup.max) {
          return entryGroup;
        }
      }
    }
    return '';
  }

  public checkEventsAndGroups(meet :Meet) {
    if(meet.minimum_timesheet) {
      let timesheet = meet.minimum_timesheet;
      meet.entry_groups_arr = new Array();
      meet.race_types_arr = new Array();
      meet.genders_arr = new Array();
      meet.entry_events = {};

      for(let group in timesheet.entry_groups_arr) {
        meet.entry_groups_arr.push(timesheet.entry_groups_arr[group]);
      }

      for(let race_type in timesheet.race_types_arr) {
        meet.race_types_arr.push(timesheet.race_types_arr[race_type]);
      }

      for(let gender in timesheet.genders_arr) {
        meet.genders_arr.push(timesheet.genders_arr[gender]);
      }

      for(let i = 0; i < meet.genders_arr.length; i++) {
        meet.entry_events[meet.genders_arr[i]] = {};
        for(let j = 0; j < meet.entry_groups_arr.length; j++) {
          meet.entry_events[meet.genders_arr[i]][meet.entry_groups_arr[j]] = {};
          for(let k = 0; k < meet.race_types_arr.length; k++) {
            meet.entry_events[meet.genders_arr[i]][meet.entry_groups_arr[j]][meet.race_types_arr[k]] = true;
          }
        }
      }
    }
  }

  private processMinAndMax(swimmer :Swimmer, meet :Meet, deferred) {
    if(swimmer) {
      this.swimtimesService.getBestTimes(swimmer, meet.qual_date).then((bestTimes) => {
        var mins = JSON.parse(meet.minimum_timesheet.timesheet_data);
        var maxs = JSON.parse(meet.maximum_timesheet.timesheet_data);
        var swimmerGroup = this.getGroupForSwimmer(swimmer, meet).id;
        var events = [];
        var types = meet.entry_events[swimmer.gender][swimmerGroup];
        for(let type in types) {
          if(types[type]) {
            var race = this.swimData.races[type];
            race.min = mins[swimmer.gender][swimmerGroup][type];
            race.max = maxs[swimmer.gender][swimmerGroup][type];

            var best = this.getBestTimeForRaceType(bestTimes, race.id);
            if(best && race.min) {
              race.best = best;
              race.time_present = true;
              if((race.min && race.max && best.time <= race.min && best.time >= race.max) ||
                (race.min && !race.max && best.time <= race.min)) {
                  race.qualify = true;
              } else {
                race.qualify = false;
              }
            } else {
              race.time_present = false;
            }
            events.push(race);
          }
        }
        deferred(events);
      });
    }
  }

  private processMinimumOnly(swimmer :Swimmer, meet :Meet, deferred) {
    if(swimmer) {
      this.swimtimesService.getBestTimes(swimmer, meet.qual_date).then((bestTimes) => {
        var events = [];
        var mins = JSON.parse(meet.minimum_timesheet.timesheet_data);
        var hasAutos = false;
        if(meet.auto_timesheet) {
          var autos = JSON.parse(meet.auto_timesheet.timesheet_data);
          hasAutos = true;
        }
        var swimmerGroup = this.getGroupForSwimmer(swimmer, meet).id;
        var types = meet.entry_events[swimmer.gender][swimmerGroup];

        for(let type in types) {
          if(types[type]) {
            var race = this.swimData.races[type];
            race.min = mins[swimmer.gender][swimmerGroup][type];
            if(hasAutos) {
              race.auto = autos[swimmer.gender][swimmerGroup][type];
            }
            var best = this.getBestTimeForRaceType(bestTimes, race.id);
            if(best && race.min) {
              race.best = best;
              race.time_present = true;
              if(race.min && best.time <= race.min) {
                if(hasAutos) {
                  if(best.time <= race.auto) {
                    race.qualify_auto = true;
                  } else {
                    race.qualify_auto = false;
                  }
                }

                race.qualify = true;
              } else {
                race.qualify = false;
              }
            } else {
              race.time_present = false;
            }
            events.push(race);
          }
        }
        deferred(events);
      });
    }
  }

  private processMaximumOnly(swimmer :Swimmer, meet :Meet, deferred) {

  }

  private processEvents(swimmer :Swimmer, meet :Meet, deferred) {

  }

  public getBestTimeForRaceType(bestTimes, raceType) {
    for(let i = 0; i < bestTimes.length; i++) {
      if(bestTimes[i].race_type == raceType) {
        return bestTimes[i];
      }
    }
  }

  public getTotalCostForEntries(raceEntries :Array<any>, meet:Meet) {
    var total = 0;
    if(raceEntries) {
      total += raceEntries.length * meet.cost_per_race;
      total += meet.admin_fee;
    }
    return total;
  }

  public getEntryEvents(swimmer :Swimmer, meet :Meet) {
    return new Promise((resolve, reject) => {
      if (meet.minimum_timesheet && meet.maximum_timesheet) {
        this.processMinAndMax(swimmer, meet, resolve);
      } else if (!meet.minimum_timesheet && meet.maximum_timesheet) {
        this.processMaximumOnly(swimmer, meet, resolve);
      } else if (meet.minimum_timesheet && !meet.maximum_timesheet) {
        this.processMinimumOnly(swimmer, meet, resolve);
      } else {
        this.processEvents(swimmer, meet, resolve);
      }
    });
  }
}
