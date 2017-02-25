import { Injectable }     from '@angular/core';
import { Http, Response, Headers }   from '@angular/http';

import { Storage }        from '@ionic/storage';
import { Platform }       from 'ionic-angular';

import { EnvService }       from './env.service';
import { HttpProvider }     from './http.provider';

import { Observable }     from 'rxjs/Observable';
import { Subject }        from 'rxjs/Subject';

import { User } from '../models/user';

import 'rxjs/Rx';

@Injectable()
export class UserService extends HttpProvider {
  USER_STORE :string = 'user';

  private user_signup_url: string;
  private user :User;

  constructor(private storage :Storage, private platform :Platform, private http :Http, private nonhttp :Http, private env: EnvService) {
    super();
    this.user_signup_url = env.getDataUrl() + 'members/signup';
  }

  load(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        this.storage.get(this.USER_STORE).then((val) => {
          if (val) {
            this.user = new User(val);
            resolve(this.user);
          } else {
            resolve();
          }
        });
      });
    });
  }

  signup(first_name: string, last_name: string, email: string): Observable<User>  {

    let payload = {
      first_name: first_name,
      last_name: last_name,
      email: email
    };

    return this.http
               .put(this.user_signup_url, JSON.stringify(payload))
               .map(res => this.extractUser(res))
               .catch(this.handleError);
  }

  extractUser(res: Response) {
    let result = res.json();
    if(result.status == "OK" && result.member) {
      return new User(result.member);
    } else {
      throw new Error("Failed to save member details");
    }
  }

  store(user: any) {
    this.user = user;
    return this.storage.set(this.USER_STORE, this.user);
  }

  clear() {
    this.storage.remove(this.USER_STORE);
    this.user = null;
  }
}
