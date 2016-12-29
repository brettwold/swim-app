export class Swimmer {
  _id :string;
  regno :string;
  first_name :string;
  last_name :string;
  times :Array<any>;
  club :string;
  dob :string;
  gender :string;

  constructor(swimmerData :any) {
    Object.assign(this, swimmerData);
  }

}
