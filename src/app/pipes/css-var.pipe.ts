import { Pipe, PipeTransform } from '@angular/core';
import { getCssVariable } from '../helpers';

@Pipe({
  name: 'cssVariable'
})
export class CssVarPipe implements PipeTransform {

  transform(variable: string, isInteger: boolean = true): number {
    if (!variable.startsWith('--')) variable = '--' + variable;
    let res: any = getCssVariable(document.documentElement, variable);

    if (res.endsWith('rem')) {
      res = res.replace('rem', '') * 16;
    } else if(res.endsWith('px')) {
      res = res.replace('px', '');
    }

    if (isInteger) {
      res = +res;
    }

    return res;
  }

}
