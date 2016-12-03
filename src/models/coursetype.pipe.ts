import { Injectable }     from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'coursetype',
    pure: false
})
@Injectable()
export class CourseTypePipe implements PipeTransform {
    transform(items: any, args: string): any {
      if (items) {
        return items.filter(item => item.course_type === args);
      }
    }
}
