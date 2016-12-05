export class Swimmer {
  regno :string;
  first_name : string;
  last_name: string;
  times: Array<any>;
  club: string;

  constructor(asa_num :string) {
    this.regno = asa_num;
  }

  public setData(swimmerData: any) {
    Object.assign(this, swimmerData);
  }

}
