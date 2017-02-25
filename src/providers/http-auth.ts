import { Http, Request, RequestOptions, RequestOptionsArgs, Response, ConnectionBackend, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/mergeMap";

export interface IAuthConfig {
  globalHeaders: Array<Object>;
  headerName: string;
  headerPrefix: string;
  noJwtError: boolean;
  noTokenScheme?: boolean;
}

export interface IAuthConfigOptional {
  globalHeaders?: Array<Object>;
  headerName?: string;
  headerPrefix?: string;
  noJwtError?: boolean;
  noTokenScheme?: boolean;
}

export class AuthConfigConsts {
  public static DEFAULT_HEADER_NAME = 'Authorization';
  public static HEADER_PREFIX_BEARER = 'Bearer ';
}

const AuthConfigDefaults: IAuthConfig = {
  headerName: AuthConfigConsts.DEFAULT_HEADER_NAME,
  headerPrefix: null,
  noJwtError: false,
  globalHeaders: [],
  noTokenScheme: false
};

export class AuthConfig {

  private _config: IAuthConfig = {} as IAuthConfig;

  constructor(config?: IAuthConfigOptional) {
    config = config || {};
    Object.assign(this._config, AuthConfigDefaults, config);
    if (this._config.headerPrefix) {
      this._config.headerPrefix += ' ';
    } else if (this._config.noTokenScheme) {
      this._config.headerPrefix = '';
    } else {
      this._config.headerPrefix = AuthConfigConsts.HEADER_PREFIX_BEARER;
    }
  }

  public getConfig():IAuthConfig {
    return this._config;
  }
}

export abstract class AuthHttp extends Http {

  private config: IAuthConfig;
  private origRequest: Request;

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, options: AuthConfig) {
    super(backend, defaultOptions);
    this.config = options.getConfig();
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
    if (!this.config.noJwtError && !token) {
      return Observable.throw(new Error('No JWT token given'));
    } else {
      req.headers.set(this.config.headerName, this.config.headerPrefix + token);
    }

    return super.request(req);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (typeof url === 'string') {
      return this.get(url, options); // Recursion: transform url from String to Request
    }

    // from this point url is always an instance of Request;
    let req: Request = url as Request;
    let token: string | Promise<string> = this.getToken();
    if (token instanceof Promise) {
      return Observable.fromPromise(token).mergeMap((jwtToken: string) => this.requestWithToken(req, jwtToken));
    } else {
      return this.requestWithToken(req, token);
    }
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

  private intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err, source) => {
      if (err.status == 401) {
        console.log("Unauthorised need to refresh token");
        let orig = this.origRequest;
        return this.refreshToken().flatMap(res => {
          if(res) {
            let data = res.json();
            if(data.access_token) {
              return Observable.fromPromise(this.saveToken(data.access_token));
            } else {
              return Observable.create('');
            }
          }
        }).flatMap(token => {
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
