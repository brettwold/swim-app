import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HTTP }           from '@ionic-native/http/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { EnvService } from './providers/env.service';
import { SwimmersService } from './providers/swimmers';
import { SwimtimesService } from './providers/swimtimes';
import { AsaService } from './providers/asa.service';
import { RecordsService } from './providers/records.service';
import { TimeUtils } from './providers/timeutils.service';
import { SwimData } from './providers/swimdata';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, HttpModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    EnvService,
    SwimmersService,
    SwimtimesService,
    AsaService,
    TimeUtils,
    SwimData,
    RecordsService,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
