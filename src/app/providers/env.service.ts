import { Injectable }     from '@angular/core';
import { Platform }       from '@ionic/angular';

const PROD_ENV = {
  "PRODUCTION" : false,
  "ASA_URL"   : "https://swimmingresults.org/",
};

const DEV_ENV = {
  "PRODUCTION" : false,
  "ASA_URL"   : "/asa/",
};

@Injectable()
export class EnvService {

  public env: any;

  constructor(platform: Platform) {
    if(platform.is('cordova')) {
      console.log("Using production env");
      this.env = PROD_ENV;
    } else {
      console.log("Using development env");
      this.env = DEV_ENV;
    }
  }

  public getAsaUrl() {
    return this.env.ASA_URL;
  }
}
