import {
	AfterViewInit,
	Directive,
	ElementRef,
	HostListener,
	Input,
	Renderer2,
} from '@angular/core';
import { CommercialCalendarActivity } from 'src/app/data/commercial-calendar-activity/commercial-calendar-activity.model';
import { CalendarUiService } from '../services/calendar-ui.service';
import { domElementsOverlap, readHorizontalOverlapFor, readVerticalOverlapFor } from 'src/app/helpers';

@Directive({
	selector: '[overlapWith]',
})
export class CheckOverlapDirective implements AfterViewInit {
	@Input('activity') public item!: CommercialCalendarActivity;
	@Input('overlapWith') public items!: CommercialCalendarActivity[];
	@Input() public rowGap!: number;

	constructor(
		private element: ElementRef,
		private calendarUiService: CalendarUiService,
		private renderer: Renderer2,
	) {}

	ngAfterViewInit(): void {
		this.executeCheck();
	}

	@HostListener('window:resize')
	private executeCheck() {
		const current = this.element.nativeElement;
		const currentRect = current.getBoundingClientRect();
		const doms = [current];
		if (this.items?.length) {
			this.items.forEach((item) => {
				// TODO only get elements in range
				if (
					item.activityTypeId == this.item.activityTypeId &&
					item.id !== this.item.id
				) {
					const dom: any = document.querySelector(`.activity-${item.id}`);
					if (dom && domElementsOverlap(dom, current)) {
						let bound: any = [];
						let min = 100;
						let domRect = dom.getBoundingClientRect();
						if (domRect.y == currentRect.y) {
							bound = readHorizontalOverlapFor(dom, current);
						} else if (domRect.x == currentRect.x) {
							bound = readVerticalOverlapFor(dom, current);
						}

						if (bound?.length) {
							bound = bound.map((a: number) => Math.abs(a));
							min = Math.min.apply(null, bound);
						}

						if (min >= this.rowGap) {
							return doms.push(dom);
						}
					}
				}
				return;
			});
		}
		if (doms?.length > 1) {
			this.calendarUiService.stackedDoms$.next(doms.map((a) => a.id));
		}
	}
}
