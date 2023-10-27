import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	Output,
} from '@angular/core';
import { CommercialCalendarActivity } from 'src/app/data/commercial-calendar-activity/commercial-calendar-activity.model';
import { CalendarUiService } from '../services/calendar-ui.service';
import { getDomAttributeInteger, ngForTrackByFn } from 'src/app/helpers';

@Component({
	selector: 'commercial-calendar-activity',
	templateUrl: './commercial-calendar-activity.component.html',
	styleUrls: ['./commercial-calendar-activity.component.scss'],
})
export class CommercialCalendarActivityComponent
	implements AfterViewInit, OnDestroy
{
	@Input() public activity!: CommercialCalendarActivity;
	@Input() public colSize!: number;
	@Input() public mediaSize!: number;
	@Input() public isAdmin!: boolean;

	@Output() public onClick: EventEmitter<any> = new EventEmitter();

	@Output() public onEdit: EventEmitter<any> = new EventEmitter();
	@Output() public onDelete: EventEmitter<any> = new EventEmitter();

	public trackByIndex: any = ngForTrackByFn();

	constructor(
		private calendarUiService: CalendarUiService,
		private element: ElementRef,
	) {}

	ngAfterViewInit(): void {
		if (!this.activity?.products?.length)
			this.onRender(this.activity?.products);
	}

	ngOnDestroy(): void {
		let dims: any = {};
		const element = this.element?.nativeElement ?? {};

		if (element) {
			dims = element.getBoundingClientRect().toJSON() ?? {};
		}
		this.calendarUiService.updateActivityDimensions(this.activity, {
			...dims,
			marginTop: 0,
			height: 0,
		});
	}

	public onRender(products?: any[]) {
		let dims: any = {};
		const domElement: any = this.element.nativeElement;

		if (domElement) {
			dims = {
				...domElement.getBoundingClientRect().toJSON(),
				marginTop: getDomAttributeInteger(domElement, 'marginTop'),
			};
		}

		this.calendarUiService.updateActivityDimensions(this.activity, dims);
	}

	@HostListener('window:resize')
	private updateRender() {
		if (!this.activity?.products?.length) this.onRender();
	}
}
