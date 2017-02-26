import { TimeUtils }      from '../providers/timeutils.service';

const timeUtils = new TimeUtils();

export class SwimTime {
  source: string;
  race_type: number;
  date: string;
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

  constructor () {
  }

  public setFormattedTime(timeStr :string) {
    this.time_orig = timeStr;
    let tenths = timeUtils.getHundredthsFromString(timeStr);
    this.time = tenths;
  }

  public setData(swimTime :any) {
    Object.assign(this, swimTime);
  }
}
