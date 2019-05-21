import { TimeUtils }      from '../providers/timeutils.service';
import * as moment from 'moment';

const timeUtils = new TimeUtils();

export class Record {

  club: string;
  race_type: number;
  gender: string;
  age: number;
  name: string;
  date_set: string; // dd/mm/yyyy
  unix: number;
  time: number;
  time_orig: string;

  constructor(club: string, race_type: number, gender: string, age: number, name: string, date_set: string, time_orig: string) {
    this.club = club;
    this.race_type = race_type;
    this.gender = gender;
    this.age = age;
    this.name = name;
    this.date_set = date_set;
    this.time_orig = time_orig;
    this.setupFormattedTime();
    this.setupDateAchieved();
  }

  private setupFormattedTime() {
    this.time = timeUtils.getHundredthsFromString(this.time_orig);;
  }

  private setupDateAchieved() {
    this.unix = moment(this.date_set, 'DD-MM-YYYY').unix();
  }

}
