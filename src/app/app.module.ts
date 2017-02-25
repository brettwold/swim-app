import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Http, HttpModule, JsonpModule, XHRBackend, RequestOptions, ConnectionBackend } from '@angular/http';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import { EnvService } from '../providers/env.service';
import { SwimmersService } from '../providers/swimmers';
import { SwimtimesService } from '../providers/swimtimes';
import { MeetService } from '../providers/meet.service';
import { EntryService } from '../providers/entry.service';
import { AsaService } from '../providers/asa.service';
import { UserService } from '../providers/user';
import { TimeUtils } from '../providers/timeutils.service';
import { SwimData } from '../providers/swimdata';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TimesPage } from '../pages/times/times';
import { HistoryPage } from '../pages/times/history';
import { MeetsPage } from '../pages/meets/meets';
import { MeetEntryPage } from '../pages/meets/meetentry';
import { MeetDetailPage } from '../pages/meets/meetdetail';
import { MeetPayPage } from '../pages/meets/meetpay';
import { SwimmerEditPage } from '../pages/swimmer/swimmer';
import { AddPage } from '../pages/swimmer/add';
import { EntriesPage } from '../pages/entries/entries';

import { DisplayTimeComponent }    from '../models/displaytime';
import { CourseTypePipe } from '../models/coursetype.pipe'
import { ValuesPipe } from '../models/values.pipe'

import { HttpInterceptor } from '../providers/http-interceptor';
import { AuthConfig } from '../providers/http-auth';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '951b74cb'
  }
};

import * as LocalForage from 'localforage'
LocalForage.setDriver([LocalForage.INDEXEDDB, LocalForage.WEBSQL, LocalForage.LOCALSTORAGE]);
let storage = new Storage();

export function getInterceptHttp(backend: ConnectionBackend, defaultOptions: RequestOptions, envService: EnvService, storage: Storage) {
  return new HttpInterceptor(backend, defaultOptions, envService, storage, new AuthConfig({
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}]
  }));
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    SignupPage,
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
    AddPage,
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
    SignupPage,
    TabsPage,
    TimesPage,
    HistoryPage,
    MeetsPage,
    MeetDetailPage,
    MeetEntryPage,
    MeetPayPage,
    EntriesPage,
    SwimmerEditPage,
    AddPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: Http,
      useFactory: getInterceptHttp,
      deps: [XHRBackend, RequestOptions, EnvService, Storage]
    },
    EnvService,
    Storage,
    AsaService,
    SwimData,
    TimeUtils,
    SwimmersService,
    SwimtimesService,
    MeetService,
    EntryService,
    UserService
  ]
})
export class AppModule {}
