import { Injectable }     from '@angular/core';
import { Platform }       from 'ionic-angular';
import { Schema }         from './schema';

import { Swimmer }        from '../models/swimmer';

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

  getBestTimes(swimmer :Swimmer, qualDate :string) {
    return new Promise((resolve, reject) => {
      // TODO - replace with real lookup using qual date here
      // this.schema.db.select().from(this.schema.swimtimes).exec().then((rows) => {
      //     resolve(rows);
      //   }
      // );

      console.log("RETURNING SWIMMER");
      console.log(swimmer.times);

      resolve(swimmer.times);
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
