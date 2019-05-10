import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DisplayTimeComponent } from './display-time.component'

@NgModule({
  declarations: [
    DisplayTimeComponent
  ],
  imports: [
    IonicModule, CommonModule
  ],
  exports: [
    DisplayTimeComponent
  ]
})
export class ComponentsModule { }
