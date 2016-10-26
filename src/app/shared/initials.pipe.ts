import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  transform(value:any) {
        if (value) {
            return value.charAt(0).toUpperCase();
        }
        return value;
    }

}
