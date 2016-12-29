import { inject, TestBed }    from '@angular/core/testing';
import { AsaService }         from './asa.service';
import { SwimData }           from './swimdata.service';
import { TimeUtils }          from './timeutils.service';
import { HttpMock }           from '../mocks';
import { Http, Response }     from '@angular/http';
import { mock, when, instance, verify, anyString }           from 'ts-mockito';
import { Observable }         from 'rxjs/Observable';

//import besttimes              from '../test/besttimes.html!text';

const besttimes = "";
let asaService: AsaService = null;

describe('ASA Service', () => {
  let mockedHttp:Http = mock(Http);
  let mockedResponse:Response = mock(Response);

  when(mockedHttp.get(anyString())).thenReturn(Observable.create(observer => {
      observer.next(instance(mockedResponse));
      observer.complete();
  }));

  when(mockedResponse.text()).thenReturn(besttimes);

  beforeEach(() => {
      asaService = new AsaService(instance(mockedHttp), new SwimData(), new TimeUtils());
  });

  it('should call get best times URL', () => {
    asaService.getSwimmer("123456").subscribe();
    verify(mockedHttp.get("https://swimmingresults.org/individualbest/personal_best.php?mode=A&tiref=123456")).called();
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
