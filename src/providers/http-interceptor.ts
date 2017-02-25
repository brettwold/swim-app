import { Response, RequestOptions, ConnectionBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';

import { AuthHttp, AuthConfig } from './http-auth';

export class HttpInterceptor extends AuthHttp {

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions,
    private envService: EnvService, private storage: Storage, config: AuthConfig) {
    super(backend, defaultOptions, config);
  }

  protected getToken(): Promise<string> {
    return this.storage.get('id_token').then((token) => {
      if(!token) {
        return null;
      } else {
        return token;
      }
    });
  }

  protected saveToken(token: string): Promise<string> {
    return this.storage.set('id_token', token);
  }

  protected refreshToken(): Observable<Response> {
    return super.post(this.envService.getDataUrl() + 'authenticate', {
      access_key_id: this.envService.getAccessId(),
      access_key_secret: this.envService.getAccessSecret()
    }, null, true);
  }
}
