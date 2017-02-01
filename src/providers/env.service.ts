import { Injectable }     from '@angular/core';
import { Platform }       from 'ionic-angular';

const PROD_ENV = {
  "PRODUCTION" : false,
  "ASA_URL"   : "https://swimmingresults.org/",
  "DATA_URL"   : "https://meets.annalytics.co.uk/api/",
  "API_ACCESS_ID" : "44ea2ffb-5033-4d07-b443-0d8d0f8c9329",
  "API_ACCESS_SECRET" : "oLV6lxr760m87Me5tCEUnISWTTrT63X9Zp7ZgbqvdkXbhnh5bvVeBEN5CJNJC3r7"
};

const DEV_ENV = {
  "PRODUCTION" : false,
  "ASA_URL"   : "/asa/",
  "DATA_URL"   : "http://meets.localhost:3456/api/",
  "API_ACCESS_ID" : "44ea2ffb-5033-4d07-b443-0d8d0f8c9329",
  "API_ACCESS_SECRET" : "oLV6lxr760m87Me5tCEUnISWTTrT63X9Zp7ZgbqvdkXbhnh5bvVeBEN5CJNJC3r7"
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
