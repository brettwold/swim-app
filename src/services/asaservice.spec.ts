import { inject, TestBed } from '@angular/core/testing';
import { AsaService } from './asa.service';
import { SwimData } from './swimdata.service';
import { TimeUtils } from './timeutils.service';
import { HttpMock } from '../mocks';

let asaService: AsaService = null;

describe('ASA Service', () => {

  beforeEach(() => {
      asaService = new AsaService(<any>new HttpMock(), new SwimData(), new TimeUtils() );
  });

  it('should request swimmer details', () => {

    asaService.getSwimmer('123456').subscribe((swimmer) => {
      expect(swimmer).toBeDefined();
    });

  });

});
