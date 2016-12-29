import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';



// IONIC:

export class ConfigMock {

  public get(): any {
    return '';
  }

  public getBoolean(): boolean {
    return true;
  }

  public getNumber(): number {
    return 1;
  }
}

export class FormMock {
  public register(): any {
    return true;
  }
}

export class NavMock {

  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }
}

export class PlatformMock {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class MenuMock {
  public close(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

// OTHERS

export class HttpMock {
  public post(): Observable<Response> {
    return Observable.create(observer => {
        observer.next(new ResponseMock());
        observer.complete();
    });
  }
  public get(): Observable<Response> {
    return Observable.create(observer => {
        observer.next(new ResponseMock());
        observer.complete();
    });
  }
}

export class ResponseMock {
  public text(): string {
    return "<div></div>";
  }
}
