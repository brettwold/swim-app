export class Meet {
  public static AGE_AT_DEC :string = 'AOD';
  public static AGE_ON_ENTRY :string = 'AOE';
  public static AGE_AT_MEET_DATE :string = 'AME';

  id: string;
  name: string;
  title: string;
  meet_date: string; // YYYY-MM-dd
  end_date: string; // YYYY-MM-dd
  qual_date: string; // YYYY-MM-dd
  venue: string;
  course_type: string;
  lanes: number;
  meet_type: string;
  age_type: string;
  genders: Array<any>;
  entry_groups: Array<any>;
  race_types: Array<any>;
  cost_per_race: number;
  admin_fee: number;
  promoter: string;
  minimum_timesheet: any;
  maximum_timesheet: any;
  auto_timesheet: any;
  entry_events: any;

  constructor(data :any) {
    Object.assign(this, data);
  }
}
