import { TimeUtils }      from '../providers/timeutils.service';
import * as moment from 'moment';

const timeUtils = new TimeUtils();

export class SwimTime {
  source: string;
  race_type: number;
  date: string;
  unix: number;
  time: number;
  time_orig: string;
  conv: number;
  fina_points: number;
  round: string;
  meet_name: string;
  venue: string;
  license: string;
  level: number;
  swimmer_regno: number;
  more: boolean;

  constructor (data :any) {
    Object.assign(this, data);
  }

  public setFormattedTime(timeStr :string) {
    this.time_orig = timeStr;
    let tenths = timeUtils.getHundredthsFromString(timeStr);
    this.time = tenths;
  }

  public setDateAchieved(dateStr: string) {
    this.unix = moment(dateStr, 'YYYY-MM-DD').unix();
    this.date = dateStr;
  }

  public setData(swimTime :any) {
    Object.assign(this, swimTime);
  }
}
