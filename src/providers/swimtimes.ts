import { Injectable }     from '@angular/core';
import { Platform }       from 'ionic-angular';
import { Schema }       from './schema';
import * as lf    from 'lovefield';

@Injectable()
export class SwimtimesService {

  private schema :Schema;

  constructor(private platform :Platform) {
    Schema.buildSchema(platform).then((schema) => {
      this.schema = schema;
    });
  }

  save(time :any) {
    var row = this.schema.swimtimes.createRow(time);
    return this.schema.db.insertOrReplace().into(this.schema.swimtimes).values([row]).exec();
  }

  getBestTimes(qualDate: Date) {
    return new Promise((resolve, reject) => {
      this.schema.db.select().from(this.schema.swimtimes).exec().then((rows) => {
          resolve(rows);
        }
      );
    });
  }

  getTimesForCourseType(courseType: string) {

  }

  getTimesForStrokeType(strokeType: number) {

  }

  clear() {
    this.schema.db.delete().from(this.schema.swimtimes).exec();
  }
}
