export class Swimmer {
  asa_num :string;
  first_name : string;
  last_name: string;
  times: Array<any>;

  constructor(asa_num :string) {
    this.asa_num = asa_num;
  }

  public setData(swimmerData: any) {
    Object.assign(this, swimmerData);
  }

}
