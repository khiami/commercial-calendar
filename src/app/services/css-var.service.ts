import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { hyphenate } from '../helpers';

@Injectable({
  providedIn: 'root'
})
export class CssVarService {

  private renderer: Renderer2;
  private vars: any = {};

  constructor(
    private rendererFactory: RendererFactory2
  ) { 
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public update(item?: any): void {
    try {
      if (item) this.vars = {...this.vars, ...item};
      this.renderer.setProperty(
        document.querySelector('style.root'), 
        'innerText', 
        `:root {${ Object.entries(this.vars).map(([key, value])=> `--${key}: ${value}`).join(';')}}`
      );

    } catch(e) {
      console.log('[CssVarService] updateVars caught ', e);
    }
  }
}
