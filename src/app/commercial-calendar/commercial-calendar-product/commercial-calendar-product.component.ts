import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	HostListener,
	Input,
	OnInit,
	Output,
} from '@angular/core';

@Component({
	selector: 'commercial-calendar-product',
	templateUrl: './commercial-calendar-product.component.html',
	styleUrls: ['./commercial-calendar-product.component.scss'],
})
export class CommercialCalendarProductComponent implements OnInit {
	@Input() public product?: any;
	@Input() public colSize!: number;
	// @Input() public isNarrow: boolean = false;
	@Input() public mediaSize!: number;

	@Output() public onRender: EventEmitter<void> = new EventEmitter();
	@Output() public onClick: EventEmitter<any> = new EventEmitter();

	public url!: string;

	constructor(
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {
		if (this.product?.assets?.length) {

			let assets: any[] = this.product?.assets??[];
			let asset = assets.find(a=> a.angle == 'main') ?? assets.find(a=> a.angle = 'outside');

			let keys = Object.keys(asset?.cache??{});
			let keysMin = keys.map(a=> parseInt(a));
			let min = Math.min.apply(null, keysMin);
			let keyName = keys.find(key=> parseInt(key) == min);

			if (keyName?.length) {
				this.url = asset.cache[keyName].url;
			}
		}
		
		setTimeout(() => this.cdr.markForCheck());
	}

	@HostListener('click')
	private productClicked() {
		this.onClick.emit(this.product);
	}

	@HostListener('window:resize')
	private updateRender() {
		this.onRender.emit();
	}
}
