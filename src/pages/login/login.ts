import { Component } from '@angular/core';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  constructor(public auth: Auth, public user: User) {

  }

  signup() {
    let details: UserDetails = {'email': 'hi@ionic.io', 'password': 'puppies123'};

    this.auth.signup(details).then(() => {
      // `this.user` is now registered
    }, (err: IDetailedError<string[]>) => {
      for (let e of err.details) {
        if (e === 'conflict_email') {
          alert('Email already exists.');
        } else {
          // handle other errors
        }
      }
    });
  }
}
