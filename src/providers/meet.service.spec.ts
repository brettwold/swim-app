import { Storage }        from '@ionic/storage';
import { Http, Response } from '@angular/http';
import { mock, when, instance, verify, anyString }           from 'ts-mockito';
import { Observable }     from 'rxjs/Observable';

import { TestEnvironment }    from './testenvironment.spec';

import { EnvService }     from './env.service';
import { MeetService }    from './meet.service';
import { SwimData }       from './swimdata';
import { TimeUtils }      from './timeutils.service';

import { Meet }           from '../models/meet';
import { Swimmer }        from '../models/swimmer';

let testEnv = new TestEnvironment();

let env :EnvService;
let http :Http;
let storage :Storage;
let meetService :MeetService = null;

describe('Meets Service', () => {

  beforeEach(() => {
    env = testEnv.getEnv();
    http = testEnv.getHttp();
    storage = testEnv.getStorage();
    meetService = new MeetService(http, env, new SwimData(storage, http, env), new TimeUtils());
  });

  it('should call get meets URL', () => {
    meetService.getMeets().subscribe();

    testEnv.verifyHttpWasCalled("http://mockapi/meets");
  });

  it('should return 0 for no swimmer', () => {
    testEnv.setupMeetForAgeAtMeetDate('2016-12-01');

    let age :number = meetService.ageAtMeet(null, testEnv.getMeet());
    expect(age).toEqual(0);
  });

  it('should return 0 for no meet', () => {
    testEnv.setupSwimmerDateOfBirth('2006-01-05');

    let age :number = meetService.ageAtMeet(testEnv.getSwimmer(), null);
    expect(age).toEqual(0);
  });

  it('should return age at meet AME', () => {
    testEnv.setupMeetForAgeAtMeetDate('2017-06-01');
    testEnv.setupSwimmerDateOfBirth('2006-01-05');

    let age :number = meetService.ageAtMeet(testEnv.getSwimmer(), testEnv.getMeet());
    expect(age).toEqual(11);
  });

  it('should return age at dec AOD', () => {
    testEnv.setupMeetForAgeAtMeetDate('2016-12-01');
    testEnv.setupSwimmerDateOfBirth('2006-01-05');

    let age :number = meetService.ageAtMeet(testEnv.getSwimmer(), testEnv.getMeet());
    expect(age).toEqual(10);
  });

  it('should return age on entry AOE', () => {
    testEnv.setupMeetForAgeAtMeetDate('2017-12-01');
    testEnv.setupSwimmerDateOfBirth('2006-01-05');

    let age :number = meetService.ageAtMeet(testEnv.getSwimmer(), testEnv.getMeet());
    expect(age).toEqual(11);
  });
});
