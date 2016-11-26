import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { HttpModule, JsonpModule } from '@angular/http';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TimesPage } from '../pages/times/times';
import { AsaService } from '../pages/times/asa.service';
import { TimeUtils } from '../pages/times/timeutils';
import { SwimData } from '../pages/times/swimdata.service';
import { DisplayTimeComponent }    from '../pages/times/displaytime';
import { CourseTypePipe } from '../pages/times/coursetype.pipe'

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    TimesPage,
    DisplayTimeComponent,
    CourseTypePipe
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
    TimesPage
  ],
  providers: [
    Storage,
    AsaService,
    SwimData,
    TimeUtils
  ]
})
export class AppModule {}
