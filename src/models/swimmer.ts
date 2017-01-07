export class Swimmer {
  regno :string;
  first_name :string;
  last_name :string;
  times :Array<any>;
  club :string;
  dob :string; // YYYY-MM-dd
  gender :string;

  constructor(swimmerData :any) {
    Object.assign(this, swimmerData);
  }

  public getBestTimes(qual_date) {
    return new Promise((resolve, reject) => {
      // TODO - replace with real lookup using qual date here
      resolve(this.times);
    });
  }

}
