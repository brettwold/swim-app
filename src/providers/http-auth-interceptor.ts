import { Http, Request, RequestOptions, RequestOptionsArgs, Response, ConnectionBackend, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/mergeMap";

export interface InterceptorConfigOptional {
  headerName?: string;
  headerPrefix?: string;
  noTokenError?: boolean;
}

const DEFAULT_HEADER_NAME = 'Authorization';
const DEFAULT_HEADER_PREFIX_BEARER = 'Bearer';

export class InterceptorConfig {

  headerName: string = DEFAULT_HEADER_NAME;
  headerPrefix: string = DEFAULT_HEADER_PREFIX_BEARER;
  noTokenError: boolean = false;

  constructor(config?: InterceptorConfigOptional) {
    config = config || {};
    Object.assign(this, config);
  }
}

export abstract class HttpAuthInterceptor extends Http {

  private origRequest: Request;

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private config: InterceptorConfig) {
    super(backend, defaultOptions);
  }

  private getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
      if (options == null) {
          options = new RequestOptions();
      }
      if (options.headers == null) {
          options.headers = new Headers();
      }
      options.headers.append('Content-Type', 'application/json');
      return options;
  }

  protected requestWithToken(req: Request, token: any): Observable<Response> {
    this.origRequest = req;
    if (!this.config.noTokenError && !token) {
      return Observable.throw(new Error('No authorization token given'));
    } else {
      req.headers.set(this.config.headerName, this.config.headerPrefix + ' ' + token);
    }

    return super.request(req);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (typeof url === 'string') {
      return this.get(url, options);
    }
    let req: Request = url as Request;
    let token: Promise<string> = this.getToken();
    return Observable.fromPromise(token).mergeMap((jwtToken: string) => this.requestWithToken(req, jwtToken));
  }

  get(url: string, options?: RequestOptionsArgs, noIntercept?: boolean): Observable<Response> {
    if (noIntercept) {
      return super.get(url, options);
    }
    return this.intercept(super.get(url, options));
  }

  post(url: string, body: any, options?: RequestOptionsArgs, noIntercept?: boolean): Observable<Response> {
    if (noIntercept) {
      return super.post(url, body, options);
    }
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  put(url: string, body: any, options?: RequestOptionsArgs, noIntercept?: boolean): Observable<Response> {
    if (noIntercept) {
      return super.put(url, body, options);
    }
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  delete(url: string, options?: RequestOptionsArgs, noIntercept?: boolean): Observable<Response> {
    if (noIntercept) {
      return super.delete(url, options);
    }
    return this.intercept(super.delete(url, options));
  }

  protected intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err, source) => {
      if (err.status == 401) {
        console.log("Unauthorised need to refresh token");
        let orig = this.origRequest;
        return this.refreshToken().mergeMap(res => {
          if(res) {
            let data = res.json();
            if(data.access_token) {
              return Observable.fromPromise(this.saveToken(data.access_token));
            } else {
              return Observable.create('');
            }
          }
        }).mergeMap(token => {
          return this.requestWithToken(orig, token);
        });
      } else {
          return Observable.throw(err);
      }
    });
  }

  protected abstract getToken(): Promise<string>;

  protected abstract saveToken(token: string): Promise<string>;

  protected abstract refreshToken(): Observable<Response>;
}
