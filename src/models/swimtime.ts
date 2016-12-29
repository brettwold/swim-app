import { TimeUtils }      from '../services/timeutils.service';

export class SwimTime {
  source: string;
  race_type: number;
  date: Date;
  time: number;
  time_orig: string;
  fina_points: number;
  round: string;
  meet_name: string;
  venue: string;
  license: string;
  level: number;

  constructor (private timeUtils: TimeUtils) {
  }

  public setFormattedTime(timeStr :string) {
    this.time_orig = timeStr;
    let tenths = this.timeUtils.getHundredthsFromString(timeStr);
    this.time = tenths;
  }

  public setData(swimTime :any) {
    Object.assign(this, swimTime);
  }
}
