import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UserService } from '../../providers/user';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  firstname: string;
  lastname: string;
  email: string;
  errorMessage: string;

  constructor(public navCtrl: NavController, public userService: UserService) {
    this.userService.load().then((user) => {
      if(user && user.access_key_id && user.access_key_secret) {
        this.navCtrl.setRoot(HomePage);
      }
    });
  }

  signup() {
    this.userService.signup(this.firstname, this.lastname, this.email).subscribe(user => {
      this.userService.store(user).then(() => {
        this.navCtrl.setRoot(HomePage);
      }, (error) => {
        this.errorMessage = <any>error
      });
    });
  }
}
