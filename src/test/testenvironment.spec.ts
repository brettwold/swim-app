import { Storage }            from '@ionic/storage';
import { Http, Response }     from '@angular/http';
import { mock, when, instance, verify, anyString, anything }           from 'ts-mockito';
import { Observable }         from 'rxjs/Observable';

import { EnvService }         from '../providers/env.service';
import { SwimData }           from '../providers/swimdata';
import { SwimtimesService }   from '../providers/swimtimes';

import { Meet }               from '../models/meet';
import { Swimmer }            from '../models/swimmer';

export class TestEnvironment {
  public static TEST_ASA_URL = "https://swimmingresults.org/";
  public static TEST_DATA_URL = "http://mockapi/";

  public mockedHttp:Http = mock(Http);
  public mockedStorage:Storage = mock(Storage);
  public mockedResponse:Response = mock(Response);
  public mockedEnv:EnvService = mock(EnvService);
  public mockedSwimtimesService:SwimtimesService = mock(SwimtimesService);

  besttimes :any;
  swimmer :Swimmer = new Swimmer({});
  meet :Meet = new Meet({});

  constructor() {
    when(this.mockedHttp.get(anyString())).thenReturn(Observable.create(observer => {
        observer.next(instance(this.mockedResponse));
        observer.complete();
    }));

    when(this.mockedResponse.json()).thenReturn({});

    when(this.mockedEnv.getAsaUrl()).thenReturn(TestEnvironment.TEST_ASA_URL);
    when(this.mockedEnv.getDataUrl()).thenReturn(TestEnvironment.TEST_DATA_URL);

    when(this.mockedStorage.get(SwimData.CONFIG_DATA_STORE)).thenReturn(new Promise((resolve, reject) => {
      resolve({});
    }));

    when(this.mockedStorage.set(SwimData.CONFIG_DATA_STORE, anything())).thenReturn(new Promise((resolve, reject) => {
      resolve({});
    }));

    when(this.mockedResponse.text()).thenReturn(this.besttimes);
  }

  getEnv() {
    return instance(this.mockedEnv);
  }

  getHttp() {
    return instance(this.mockedHttp);
  }

  getStorage() {
    return instance(this.mockedStorage);
  }

  getResponse() {
    return instance(this.mockedResponse);
  }

  getSwimtimesService() {
    return instance(this.mockedSwimtimesService);
  }

  getSwimmer() {
    return this.swimmer;
  }

  getMeet() {
    return this.meet;
  }

  setupMeetAndSwimmer(meetDate :string, meetType :string, swimmerDob :string) {
    this.setupMeetForAgeType(meetDate, meetType);
    this.setupSwimmerDateOfBirth(swimmerDob);
  }

  setupMeetForAgeType(meetDate: string, ageType: string) {
    this.meet.age_type = ageType;
    this.meet.meet_date = meetDate;
  }

  setupMeetGroups(groups :Array<number>) {
    this.meet.entry_groups = groups;
  }

  setupSwimmerDateOfBirth(dob: string) {
    this.swimmer.dob = dob;
  }

  setupMeet(meetData :any) {
    this.meet = new Meet(meetData);
  }

  setupSwimmer(swimmerData :any) {
    this.swimmer = new Swimmer(swimmerData);
  }

  setupSwimmerBestTimes(swimmertimes :any) {
    when(this.mockedSwimtimesService.getBestTimes(anything(), anything())).thenReturn(new Promise((resolve, reject) => {
      resolve(swimmertimes);
    }));
  }

  verifyHttpWasCalled(url :string) {
    verify(this.mockedHttp.get(url)).called();
  }
}
