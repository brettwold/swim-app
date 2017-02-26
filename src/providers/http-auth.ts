import { Response, RequestOptions, ConnectionBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { EnvService } from './env.service';

import { HttpAuthInterceptor, InterceptorConfig } from './http-auth-interceptor';

export class HttpAuth extends HttpAuthInterceptor {

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private envService: EnvService, private storage: Storage) {
    super(backend, defaultOptions, new InterceptorConfig({ noTokenError: true }));
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
