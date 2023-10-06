import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findxv2'
})
export class Findxv2Pipe implements PipeTransform {

  transform(collection: any[], fields: {key: string; value: any}[], multi?: boolean): any[] {
    try {
      return (collection??[])[multi ? 'filter':'find'](item=> {
        return fields.every(field=> 
          item[field.key] == field.value
        );
      })      
    } catch(e) {
      console.log('findx caught ', e);
      return [];
    }
  }

}
