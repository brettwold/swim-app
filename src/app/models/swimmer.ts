import { SwimTime }     from './swimtime';
import * as moment      from 'moment';

export class Swimmer {
  regno :number;
  first_name :string;
  last_name :string;
  times :Array<SwimTime>;
  club :string;
  dob :string; // YYYY-MM-dd
  gender :string;

  constructor(swimmerData :any) {
    Object.assign(this, swimmerData);
  }

  getAgeToday() {
    var swimmerDob = moment(this.dob, 'DD/MM/YYYY');
    var ageAt = moment();
    return ageAt.diff(swimmerDob, 'years');
  }

  getAgeAt(date :string) :number {
    var swimmerDob = moment(this.dob, 'DD/MM/YYYY');
    var ageAt = moment(date, 'YYYY-MM-DD');
    return ageAt.diff(swimmerDob, 'years');
  }
}
