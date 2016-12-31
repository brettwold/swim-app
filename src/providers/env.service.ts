import { Injectable }     from '@angular/core';

//const platform = new Platform();
//if(this.platform.is('core')) {
//  const ENV = require('../config/environment.dev');
//} else {
  //import { ENV }            from '../config/environment.prod';
  import { ENV }            from '../config/environment.dev';
//}

@Injectable()
export class EnvService {

  public getAsaUrl() {
    return ENV.ASA_URL;
  }

  public getDataUrl() {
    return ENV.DATA_URL;
  }
}
