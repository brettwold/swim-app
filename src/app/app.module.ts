import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Http, HttpModule, JsonpModule } from '@angular/http';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import { EnvService } from '../providers/env.service';
import { SwimmersService } from '../providers/swimmers';
import { SwimtimesService } from '../providers/swimtimes';
import { MeetService } from '../providers/meet.service';
import { EntryService } from '../providers/entry.service';
import { AsaService } from '../providers/asa.service';
import { TimeUtils } from '../providers/timeutils.service';
import { SwimData } from '../providers/swimdata';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { TimesPage } from '../pages/times/times';
import { HistoryPage } from '../pages/times/history';
import { MeetsPage } from '../pages/meets/meets';
import { MeetEntryPage } from '../pages/meets/meetentry';
import { MeetDetailPage } from '../pages/meets/meetdetail';
import { MeetPayPage } from '../pages/meets/meetpay';
import { SwimmerEditPage } from '../pages/swimmer/swimmer';
import { EntriesPage } from '../pages/entries/entries';

import { DisplayTimeComponent }    from '../models/displaytime';
import { CourseTypePipe } from '../models/coursetype.pipe'
import { ValuesPipe } from '../models/values.pipe'

import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '951b74cb'
  }
};

import * as LocalForage from 'localforage'
LocalForage.setDriver([LocalForage.INDEXEDDB, LocalForage.WEBSQL, LocalForage.LOCALSTORAGE]);
let storage = new Storage();

export function getAuthHttp(http :Http, envService: EnvService) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => {
      return new Promise((resolve, reject) => {
        storage.get('id_token').then((token) => {
          if(!token) {
            http.post(envService.getDataUrl() + 'authenticate', {
              access_key_id: envService.getAccessId(),
              access_key_secret: envService.getAccessSecret()
            }).subscribe((res) => {
              if(res) {
                let data = res.json();
                if(data.access_token) {
                  storage.set('id_token', data.access_token);
                  resolve(token);
                }
                reject();
              }
            });
          } else {
            resolve(token);
          }
        })
      });
    }),
  }), http);
}


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    LoginPage,
    HomePage,
    TabsPage,
    TimesPage,
    HistoryPage,
    MeetsPage,
    MeetDetailPage,
    MeetEntryPage,
    MeetPayPage,
    EntriesPage,
    SwimmerEditPage,
    DisplayTimeComponent,
    CourseTypePipe,
    ValuesPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    HttpModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    TabsPage,
    TimesPage,
    HistoryPage,
    MeetsPage,
    MeetDetailPage,
    MeetEntryPage,
    MeetPayPage,
    EntriesPage,
    SwimmerEditPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http, EnvService]
    },
    EnvService,
    Storage,
    AsaService,
    SwimData,
    TimeUtils,
    SwimmersService,
    SwimtimesService,
    MeetService,
    EntryService
  ]
})
export class AppModule {}
