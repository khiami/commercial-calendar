import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findx'
})
export class FindXPipe implements PipeTransform {

  transform(collection: any[], key: string, value: any, multi?: boolean): any {
    try {
      return (collection??[])[multi ? 'filter':'find'](a=> a[key] == value);      
    } catch(e) {
      console.log('findx caught ', e);
      return null;
    }
  }

}
