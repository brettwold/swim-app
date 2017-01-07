import { Injectable }     from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { SwimData }       from '../providers/swimdata';

@Pipe({
    name: 'coursetype',
    pure: false
})
@Injectable()
export class CourseTypePipe implements PipeTransform {
    constructor(private swimData :SwimData) {

    }

    transform(items: any, args: string): any {
      if (items) {
        return items.filter(item => this.swimData.races[item.race_type].course_type === args);
      }
    }
}
