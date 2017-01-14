import { Meet }             from './meet';
import { Swimmer }          from './swimmer';

import * as moment from 'moment';

export class Entry {
  id: string;
  entry_date :string = moment().format('YYYY-MM-DD'); // YYYY-MM-dd
  meet :Meet;
  swimmer :Swimmer;
  entries :Array<any>;
  admin_fee :number = 0;
  cost_per_race :number = 0;
  total_cost :number = 0;
  paid :boolean = false;
  paid_date :string; // YYYY-MM-dd

  constructor(data :any) {
    Object.assign(this, data);
    this.calcCostForEntries();
  }

  private calcCostForEntries() {
    this.total_cost = 0;
    if(this.entries) {
      this.total_cost += this.entries.length * this.cost_per_race;
      this.total_cost += this.admin_fee;
    }
  }

}
