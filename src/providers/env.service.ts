import { Injectable }     from '@angular/core';
import { Platform }       from 'ionic-angular';

const PROD_ENV = {
  "PRODUCTION" : false,
  "ASA_URL"   : "https://swimmingresults.org/",
  "DATA_URL"   : "https://meets.annalytics.co.uk/api/v1/",
  "API_ACCESS_ID" : "a5b02ae9-9777-43ad-8b09-cfa5b1ba5f73",
  "API_ACCESS_SECRET" : "S4RT63knOV2UPVgi4TTeefSTnu1DeJMaFr5auZvW8Se4RriHyeHTRw7iMw0qTWgu"
};

const DEV_ENV = {
  "PRODUCTION" : false,
  "ASA_URL"   : "/asa/",
  "DATA_URL"   : "http://meets.localhost:3456/api/v1/",
  "API_ACCESS_ID" : "a5b02ae9-9777-43ad-8b09-cfa5b1ba5f73",
  "API_ACCESS_SECRET" : "S4RT63knOV2UPVgi4TTeefSTnu1DeJMaFr5auZvW8Se4RriHyeHTRw7iMw0qTWgu"
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

  public getDataUrl() {
    return this.env.DATA_URL;
  }

  public getAccessId() {
    return this.env.API_ACCESS_ID;
  }

  public getAccessSecret() {
    return this.env.API_ACCESS_SECRET;
  }
}
