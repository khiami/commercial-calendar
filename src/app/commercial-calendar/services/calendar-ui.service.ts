import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommercialCalendarActivity } from 'src/app/data/commercial-calendar-activity/commercial-calendar-activity.model';
import { cap } from 'src/app/helpers';

interface WeekDimension {
	id: number;
	top: number;
	left: number;
	bottom: number;
	right: number;
	width: number;
	height: number;
	x: number;
	y: number;
	marginTop: number;
}
export class CommercialCalendarActivityEx extends CommercialCalendarActivity {
	public dimensions: WeekDimension = <WeekDimension>{};
}

@Injectable({
	providedIn: 'root',
})
export class CalendarUiService {
	public stackedDoms$: BehaviorSubject<number[]> = new BehaviorSubject([] as number[]);

	public items$: BehaviorSubject<CommercialCalendarActivityEx[]> = new BehaviorSubject([] as CommercialCalendarActivityEx[]);
	public heights$: BehaviorSubject<{ [key: string]: number }> = new BehaviorSubject({});

	private readonly margin: number = 1;
	private readonly rowGap: number = 16 * 0.25; // gives more accurate results, from applied css rule row-gap;

	public updateActivityDimensions(
		activity: CommercialCalendarActivity,
		dimensions: WeekDimension,
	) {
		let items = this.items$.getValue() ?? [];
		const item: CommercialCalendarActivityEx = {
			...activity,
			dimensions,
		};
		items = items.filter((a) => a.id != activity.id);
		items.push(item);
		this.items$.next(items);

		this.updateCalculatedHeights();
	}

	private updateCalculatedHeights() {
		let heights = {};
		const items = this.items$.getValue() ?? [];
		const typeIds = [...new Set(items.map((a) => a.activityTypeId))];

		typeIds.forEach((typeId: any) => {
			const itemsWithSameType = items.filter((a) => a.activityTypeId == typeId);
			const weekIdxs = [
				...new Set(itemsWithSameType.map((a) => a.startWeek)),
			];

			const weekHeights = weekIdxs.map((week) => {
				const itemsInWeek = itemsWithSameType.filter(
					(item) => item.startWeek == week,
				);
				const gap = cap(itemsInWeek.length - 2, 0) * this.rowGap;
				return (
					itemsInWeek.reduce(
						(a, c) =>
							(a += c.dimensions.height + c.dimensions.marginTop),
						0,
					) + gap
				);
			});
			if (typeId) {
				let xx = { 
					[typeId]: parseFloat(Math.max.apply(null, weekHeights).toFixed(2)) + this.margin,
				};
				heights = {
					...heights,
					...xx
				}

			}
		});
		this.heights$.next(heights);
	}
}
