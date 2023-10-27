import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { environment as env } from 'src/environments/environment';
@Directive({
  selector: '[fallbackSource]',
})
export class FallbackSourceDirective implements OnInit {

  @Input() assets: any[]|null = null;
  @Input() altEnabled: boolean = true;
  @Input() trackId?: number;

  private availableUrls: string[] = [];

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit(): void {
      
    if (!this.assets?.length) return;
    this.availableUrls = this.assets.map(a=> a.url);
  }

  @HostListener('error', ['$event'])
  private onError(e: ErrorEvent) {
    if (this.availableUrls?.length && this.altEnabled !== false) {

      if (this.trackId && !env.production) console.log('trackId ',this.availableUrls?.length);
      this.element.nativeElement.src = this.availableUrls.shift();
    }
  }

}
