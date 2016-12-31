import { SwimData }       from '../providers/swimdata.service';

import * as moment        from 'moment';

const config = new SwimData();

export class Meet {
  id: string;
  name: string;
  title: string;
  meet_date: Date;
  end_date: Date;
  qual_date: Date;
  venue: string;
  course_type: string;
  lanes: number;
  meet_type: string;
  age_type: string;
  genders_arr: Array<any>;
  entry_groups_arr: Array<any>;
  race_types_arr: Array<any>;
  cost_per_race: number;
  admin_fee: number;
  promoter: string;
  entry_events_data: string;
  minimum_timesheet: any;
  maximum_timesheet: any;
  auto_timesheet: any;
  entry_events: any;

  constructor(data :any) {
    Object.assign(this, data);
  }

  public ageAtMeet(swimmer) :number {
    if (!swimmer || !swimmer.dob || !this.meet_date) {
      return 0;
    }
    let dob = moment(swimmer.dob, "YYYY-MM-DD");

    if (this.age_type == 'AOD') {
      let endDecDate = moment(this.meet_date, "YYYY-MM-DD");
      endDecDate.date(31);
      endDecDate.month(11);
      let duration = moment.duration(endDecDate.diff(dob));
      return Math.floor(duration.asYears());
    } else if (this.age_type == 'AOE') {
      let now = moment();
      let duration = moment.duration(now.diff(dob));
      return Math.floor(duration.asYears());
    } else {
      let meetDate = moment(this.meet_date, "YYYY-MM-DD");
      let duration = moment.duration(meetDate.diff(dob));
      return Math.floor(duration.asYears());
    }
  }

  public getGroupForSwimmer(swimmer) :any {
    var aam = this.ageAtMeet(swimmer);
    if (aam && this.entry_groups_arr) {
      for(let i = 0; i < this.entry_groups_arr.length; i++) {
        var entryGroup = config.entry_groups[this.entry_groups_arr[i]];
        if(aam >= entryGroup.min && aam < entryGroup.max) {
          return entryGroup;
        }
      }
    }
    return '';
  }

  public checkEventsAndGroups() {
    var self = this;
    if(this.minimum_timesheet) {
      let timesheet = this.minimum_timesheet;
      self.entry_groups_arr = new Array();
      self.race_types_arr = new Array();
      self.genders_arr = new Array();
      self.entry_events = {};

      for(let group in timesheet.entry_groups_arr) {
        self.entry_groups_arr.push(timesheet.entry_groups_arr[group]);
      }

      for(let race_type in timesheet.race_types_arr) {
        self.race_types_arr.push(timesheet.race_types_arr[race_type]);
      }

      for(let gender in timesheet.genders_arr) {
        self.genders_arr.push(timesheet.genders_arr[gender]);
      }

      for(let i = 0; i < self.genders_arr.length; i++) {
        self.entry_events[self.genders_arr[i]] = {};
        for(let j = 0; j < self.entry_groups_arr.length; j++) {
          self.entry_events[self.genders_arr[i]][self.entry_groups_arr[j]] = {};
          for(let k = 0; k < self.race_types_arr.length; k++) {
            self.entry_events[self.genders_arr[i]][self.entry_groups_arr[j]][self.race_types_arr[k]] = true;
          }
        }
      }
    }
  }

  private processMinAndMax(swimmer, deferred) {
    var self = this;
    if(swimmer) {
      swimmer.getBestTimes(this.qual_date).then(function(bestTimes) {
        var mins = JSON.parse(this.minimum_timesheet.timesheet_data);
        var maxs = JSON.parse(this.maximum_timesheet.timesheet_data);
        var swimmerGroup = this.getGroupForSwimmer(swimmer).id;
        var events = [];
        var types = this.entry_events[swimmer.gender][swimmerGroup];
        for(let type in types) {
          if(types[type]) {
            var race = config.races[type];
            race.min = mins[swimmer.gender][swimmerGroup][type];
            race.max = maxs[swimmer.gender][swimmerGroup][type];

            var best = self.getBestTimeForRaceType(bestTimes, race.id);
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

  private processMinimumOnly(swimmer, deferred) {
    var self = this;
    if(swimmer) {
      swimmer.getBestTimes(self.qual_date).then(function(bestTimes) {
        var events = [];
        var mins = JSON.parse(self.minimum_timesheet.timesheet_data);
        var hasAutos = false;
        if(self.auto_timesheet) {
          var autos = JSON.parse(self.auto_timesheet.timesheet_data);
          hasAutos = true;
        }
        var swimmerGroup = self.getGroupForSwimmer(swimmer).id;
        var types = self.entry_events[swimmer.gender][swimmerGroup];

        for(let type in types) {
          if(types[type]) {
            var race = config.races[type];
            race.min = mins[swimmer.gender][swimmerGroup][type];
            if(hasAutos) {
              race.auto = autos[swimmer.gender][swimmerGroup][type];
            }
            var best = self.getBestTimeForRaceType(bestTimes, race.id);
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

  private processMaximumOnly(swimmer, deferred) {

  }

  private processEvents(swimmer, deferred) {

  }

  private getBestTimeForRaceType(bestTimes, raceType) {
    for(let i = 0; i < bestTimes.length; i++) {
      if(bestTimes[i].race_type == raceType) {
        return bestTimes[i];
      }
    }
  }

  private getTotalCostForEntries(raceEntries) {
    var total = 0;
    if(raceEntries) {
      total += raceEntries.length * this.cost_per_race;
      total += this.admin_fee;
    }
    return total;
  }

  public getEntryEvents(swimmer) {
    return new Promise((resolve, reject) => {
      if (this.minimum_timesheet && this.maximum_timesheet) {
        this.processMinAndMax(swimmer, resolve);
      } else if (!this.minimum_timesheet && this.maximum_timesheet) {
        this.processMaximumOnly(swimmer, resolve);
      } else if (this.minimum_timesheet && !this.maximum_timesheet) {
        this.processMinimumOnly(swimmer, resolve);
      } else {
        this.processEvents(swimmer, resolve);
      }
    });
  }
}
