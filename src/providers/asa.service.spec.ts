import { Storage }        from '@ionic/storage';
import { Http, Response }     from '@angular/http';
import { mock, when, instance, verify, anyString, anything }           from 'ts-mockito';
import { Observable }         from 'rxjs/Observable';

import { TestEnvironment }    from './testenvironment.spec';

import { EnvService }         from './env.service';
import { AsaService }         from './asa.service';
import { SwimData }           from './swimdata';

let testEnv = new TestEnvironment();

//import besttimes              from '../test/besttimes.html!text';

const besttimes = "";
let asaService: AsaService = null;
let env :EnvService;
let http :Http;
let storage :Storage;

describe('ASA Service', () => {

  beforeEach(() => {
    env = testEnv.getEnv();
    http = testEnv.getHttp();
    storage = testEnv.getStorage();
    asaService = new AsaService(http, env, new SwimData(storage, http, env));
  });

  it('should call get best times URL', () => {
    asaService.getSwimmer("123456").subscribe();

    testEnv.verifyHttpWasCalled(TestEnvironment.TEST_ASA_URL + "individualbest/personal_best.php?mode=A&tiref=123456");
  });

  it('should return a swimmer object', () => {
    asaService.getSwimmer('123456').subscribe((swimmer) => {
      expect(swimmer).toBeDefined();
    });
  });

  it('should return the correct swimmer', () => {
    asaService.getSwimmer('123456').subscribe((swimmer) => {
      expect(swimmer.first_name).toEqual("Conor");
    });
  });
});
