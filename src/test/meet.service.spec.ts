import { Storage }          from '@ionic/storage';
import { Http, Response }   from '@angular/http';
import { mock, when, instance, verify, anyString }           from 'ts-mockito';
import { Observable }       from 'rxjs/Observable';

import { TestEnvironment }      from './testenvironment.spec';
import { MeetTestEnvironment }  from './meet.testenvironment.spec';

import { EnvService }         from '../providers/env.service';
import { MeetService }         from '../providers/meet.service';
import { SwimData }           from '../providers/swimdata';
import { TimeUtils }          from '../providers/timeutils.service';

import { Meet }             from '../models/meet';
import { Swimmer }          from '../models/swimmer';


let testEnv :TestEnvironment;
let meetTestEnv :MeetTestEnvironment;

let env :EnvService;
let http :Http;
let storage :Storage;
let meetService :MeetService = null;

describe('Meets Service', () => {

  beforeEach(() => {
    testEnv = new TestEnvironment();
    env = testEnv.getEnv();
    http = testEnv.getHttp();
    storage = testEnv.getStorage();
    meetService = new MeetService(http, env, new SwimData(storage, http, env), new TimeUtils());
    meetTestEnv = new MeetTestEnvironment(testEnv, meetService);
  });

  it('should call get meets URL', () => {
    meetService.getMeets().subscribe();

    testEnv.verifyHttpWasCalled("http://mockapi/meets");
  });

  it('should return 0 for no swimmer', () => {
    testEnv.setupMeetForAgeType('2016-12-01', Meet.AGE_AT_MEET_DATE);

    let age :number = meetService.ageAtMeet(null, testEnv.getMeet());
    expect(age).toEqual(0);
  });

  it('should return 0 for no meet', () => {
    testEnv.setupSwimmerDateOfBirth('2006-01-05');

    let age :number = meetService.ageAtMeet(testEnv.getSwimmer(), null);
    expect(age).toEqual(0);
  });

  it('should return correct age for meet entry', () => {
    meetTestEnv.setupMeetAndSwimmerAndAssertAge('2016-12-01', Meet.AGE_AT_DEC, '2006-01-05', 10);
    meetTestEnv.setupMeetAndSwimmerAndAssertAge('2016-12-01', Meet.AGE_AT_DEC, '2006-12-31', 10);
    meetTestEnv.setupMeetAndSwimmerAndAssertAge('2016-12-01', Meet.AGE_AT_DEC, '2007-01-01', 9);
    meetTestEnv.setupMeetAndSwimmerAndAssertAge('2017-12-01', Meet.AGE_ON_ENTRY, '2006-01-05', 11);
    meetTestEnv.setupMeetAndSwimmerAndAssertAge('2017-06-01', Meet.AGE_AT_MEET_DATE, '2006-01-05', 11);
    meetTestEnv.setupMeetAndSwimmerAndAssertAge('2017-06-01', Meet.AGE_AT_MEET_DATE, '2006-06-05', 10);
  });

  it('should return correct group for swimmer', () => {
    meetTestEnv.setupMeetAndSwimmerAndAssertGroup('2016-12-01', Meet.AGE_AT_DEC, '2006-01-05', [2, 3, 4, 5, 7, 8, 9], 2);
    meetTestEnv.setupMeetAndSwimmerAndAssertGroup('2016-12-01', Meet.AGE_AT_DEC, '2005-01-05', [2, 3, 4, 5, 7, 8, 9], 3);
    meetTestEnv.setupMeetAndSwimmerAndAssertGroup('2016-12-01', Meet.AGE_AT_DEC, '2004-01-05', [2, 3, 4, 5, 7, 8, 9], 4);
    meetTestEnv.setupMeetAndSwimmerAndAssertGroup('2016-12-01', Meet.AGE_AT_DEC, '1998-01-05', [2, 3, 4, 5, 7, 8, 9], 9);
    meetTestEnv.setupMeetAndSwimmerAndAssertGroup('2016-12-01', Meet.AGE_AT_DEC, '1995-01-05', [2, 3, 4, 5, 7, 8, 9], 9);
    meetTestEnv.setupMeetAndSwimmerAndAssertGroup('2016-12-01', Meet.AGE_AT_DEC, '1995-01-05', [10, 11, 12, 13, 9], 9);
    meetTestEnv.setupMeetAndSwimmerAndAssertGroup('2016-12-01', Meet.AGE_AT_DEC, '2006-01-05', [10, 11, 12, 13, 9], 10);
    meetTestEnv.setupMeetAndSwimmerAndAssertGroup('2017-12-01', Meet.AGE_AT_DEC, '2006-01-05', [10, 11, 12, 13, 9], 11);
  });

  it('should setup entry events', () => {

  });

});
