import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { getDomAttributeInteger } from 'src/app/helpers';

export type ResizeDirection = 'vertical'|'horizontal'|'both';

@Directive({
	selector: '[resize]'
})
export class ResizeElementDirective implements AfterViewInit {

	@Input() public resize?: boolean = true;
	@Input() public resizeDirection?: ResizeDirection = 'both';
	@Input() public keepWidth?: boolean;
	@Input() public keepHeight?: boolean;

	@Output() public onResize: EventEmitter<{width: number; height: number;}> = new EventEmitter();

	constructor(
		private element: ElementRef,
		private renderer: Renderer2
	) { }

	ngAfterViewInit(): void {

		const canChangeWidth = ['both', 'horizontal'].includes(this.resizeDirection as string);
		const canChangeHeight = ['both', 'vertical'].includes(this.resizeDirection as string);
		const renderer = this.renderer;
		
		if (this.resize) {
			const el = this.element.nativeElement;
			const html = document.documentElement;
			const div = document.createElement('DIV');

			div.className = 'resizer';
			div.draggable = false;
	
			this.renderer.appendChild(this.element.nativeElement, div);
	
			let startX: number = 0;
			let	startY: number = 0;
			let	startWidth: number = 0;
			let	startHeight: number = 0;
	
			const onMouseDown = (e: MouseEvent)=> {
				startX = e.clientX;
				startY = e.clientY;
				startWidth = getDomAttributeInteger(el, 'width');
				startHeight = getDomAttributeInteger(el, 'height');
				html.addEventListener('mousemove', onMouseMove, false);
				html.addEventListener('mouseup', onMouseUp, false);
			}
	
			const onMouseMove = (e: MouseEvent)=> {
				if (canChangeWidth) renderer.setStyle(el, 'width', (startWidth + e.clientX - startX) + 'px' );
				if (canChangeHeight) renderer.setStyle(el, 'height', (startHeight + e.clientY - startY) + 'px');
			}
	
			const onMouseUp = (e: MouseEvent)=> {
				html.removeEventListener('mousemove', onMouseMove, false); 
				html.removeEventListener('mouseup', onMouseUp, false);
				this.onResize.emit({
					width: getDomAttributeInteger(el, 'width'),
					height: getDomAttributeInteger(el, 'height'),
				});
			}
	
			if (div) div.addEventListener('mousedown', onMouseDown, false);
		}
	}
}
