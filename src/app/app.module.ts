import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { HttpModule, JsonpModule } from '@angular/http';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import { SwimmersService } from '../providers/swimmers';
import { SwimtimesService } from '../providers/swimtimes';

import { AsaService } from '../services/asa.service';
import { TimeUtils } from '../services/timeutils.service';
import { SwimData } from '../services/swimdata.service';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TimesPage } from '../pages/times/times';
import { HistoryPage } from '../pages/times/history';
import { MeetsPage } from '../pages/meets/meets';
import { SwimmerEditPage } from '../pages/swimmer/swimmer';

import { DisplayTimeComponent }    from '../models/displaytime';
import { CourseTypePipe } from '../models/coursetype.pipe'
import { ValuesPipe } from '../models/values.pipe'

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    TimesPage,
    HistoryPage,
    MeetsPage,
    SwimmerEditPage,
    DisplayTimeComponent,
    CourseTypePipe,
    ValuesPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    TimesPage,
    HistoryPage,
    MeetsPage,
    SwimmerEditPage
  ],
  providers: [
    Storage,
    AsaService,
    SwimData,
    TimeUtils,
    SwimmersService,
    SwimtimesService
  ]
})
export class AppModule {}
