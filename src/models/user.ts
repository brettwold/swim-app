export class User {

  id :string;
  first_name :string;
  last_name :string;
  email :string;
  access_key_id :string;
  access_key_secret :string;

  constructor(data :any) {
    Object.assign(this, data);
  }
}
