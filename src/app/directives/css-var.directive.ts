import {
	Directive,
	ElementRef,
	HostListener,
	Input,
	OnInit,
} from '@angular/core';
import { CssVarService } from '../services/css-var.service';
import { getCssInt, ratioCalculator } from '../helpers';

@Directive({
	selector: '[css-var]',
})

// usage e.g. 1 <div class="col-md-6 keep-aspect aspect-2x1 fix-video-aspect" css-var="aspect-video-height:get:aspect-height"> // creates a css-variable --aspect-video-height of host height [after applying the ratio] '2x1'
// usage e.g. 2 <div class="col-md-6 fix-video-aspect" css-var="aspect-video-height:get:height"> // creates a css-variable --aspect-video-height of the host height
export class CssVarDirective implements OnInit {
	@Input('css-var') public cssVar!: string;
	@Input() public disableVar?: boolean;

	private native!: HTMLElement;
	private name!: string;
	private attribute!: string;
	private valid: boolean = false;

	constructor(
		private element: ElementRef,
		private varService: CssVarService,
	) {}

	ngOnInit(): void {
		if (this.disableVar) return;
		if (!this.native) this.native = this.element.nativeElement;

		// let
		let delimiter = ':get:';
		if (!this.cssVar.includes(delimiter) && this.cssVar.includes(':'))
			delimiter = ':';
		[this.name, this.attribute] = this.cssVar.split(delimiter);
		this.valid = !!this.attribute?.length && !!this.name?.length;
		if (this.valid) this.measureVar();
	}

	private measureVar() {
		if (!this.attribute?.length) return;

		let value = this.getValue();
		if (this.name?.length && !isNaN(value))
			this.varService.update({ [this.name]: value + 'px' });
	}

	private getRatio() {
		let aspect =
			[...(this.native.classList as any)].find(
				(a) => a.indexOf('aspect-') > -1,
			) ?? 'aspect-1x1';
		let [_, ratio] = aspect.match(/aspect\W(.+)$/i) ?? [];
		return ratio;
	}

	private getValue() {
		let value;
		switch (this.attribute) {
			case 'aspect-height':
				value = ratioCalculator(
					this.getRatio(),
					this.native.getBoundingClientRect?.()?.width,
				);
				break;

			case 'aspect-width':
				value = ratioCalculator(
					this.getRatio(),
					this.native.getBoundingClientRect?.().height,
				);
				break;

			default:
				value = getCssInt(window, this.attribute, this.native);
		}

		if (this.native?.hasAttribute('rect'))
			value = (this.native.getBoundingClientRect() as any)?.[
				this.attribute
			];

		return value;
	}

	@HostListener('window:resize')
	private onResize(): void {
		if (this.valid) this.measureVar();
	}
}
