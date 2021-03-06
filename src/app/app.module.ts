import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Http, HttpModule, JsonpModule, XHRBackend, RequestOptions, ConnectionBackend } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule, Storage } from '@ionic/storage';

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
import { QualifyingPage } from '../pages/qualifying/qualifying';
import { MeetEntryPage } from '../pages/meets/meetentry';
import { MeetDetailPage } from '../pages/meets/meetdetail';
import { MeetPayPage } from '../pages/meets/meetpay';
import { SwimmerEditPage } from '../pages/swimmer/swimmer';
import { AddPage } from '../pages/swimmer/add';
import { EntriesPage } from '../pages/entries/entries';
import { EntryDetailPage } from '../pages/entries/entrydetail';

import { DisplayTimeComponent }    from '../models/displaytime';
import { CourseTypePipe } from '../models/coursetype.pipe'
import { ValuesPipe } from '../models/values.pipe'

import { HttpAuth } from '../providers/http-auth';

import * as LocalForage from 'localforage'
LocalForage.setDriver([LocalForage.INDEXEDDB, LocalForage.WEBSQL, LocalForage.LOCALSTORAGE]);

export function getHttpAuth(backend: ConnectionBackend, defaultOptions: RequestOptions, envService: EnvService, storage: Storage) {
  return new HttpAuth(backend, defaultOptions, envService, storage);
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
    QualifyingPage,
    MeetsPage,
    MeetDetailPage,
    MeetEntryPage,
    MeetPayPage,
    EntriesPage,
    EntryDetailPage,
    SwimmerEditPage,
    AddPage,
    DisplayTimeComponent,
    CourseTypePipe,
    ValuesPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
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
    QualifyingPage,
    MeetsPage,
    MeetDetailPage,
    MeetEntryPage,
    MeetPayPage,
    EntriesPage,
    EntryDetailPage,
    SwimmerEditPage,
    AddPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: Http,
      useFactory: getHttpAuth,
      deps: [XHRBackend, RequestOptions, EnvService, Storage]
    },
    StatusBar,
    SplashScreen,
    EnvService,
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
