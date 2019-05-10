import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ValuesPipe } from './values.pipe';
import { CourseTypePipe } from './coursetype.pipe';

@NgModule({
  declarations: [ValuesPipe, CourseTypePipe],
  imports: [IonicModule],
  exports: [ValuesPipe, CourseTypePipe]
})
export class PipesModule {}
