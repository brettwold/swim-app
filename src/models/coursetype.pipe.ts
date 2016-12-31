import { Injectable }     from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { SwimData }       from '../providers/swimdata.service';

const swimdata = new SwimData();

@Pipe({
    name: 'coursetype',
    pure: false
})
@Injectable()
export class CourseTypePipe implements PipeTransform {
    transform(items: any, args: string): any {
      if (items) {
        return items.filter(item => swimdata.races[item.race_type].course_type === args);
      }
    }
}
