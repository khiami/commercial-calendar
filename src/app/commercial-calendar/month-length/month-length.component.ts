import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { getDateOfIsoWeek } from 'src/app/helpers';

@Component({
	selector: 'month-length',
	templateUrl: './month-length.component.html',
	styleUrls: ['./month-length.component.scss'],
})
export class MonthLengthComponent implements OnInit {
	@Input() public startAtWeek!: number;
	@Input() public month!: number;
	@Input() public year!: number;

	@HostBinding('style.width.%') public width?: number;

	ngOnInit() {
		const startOn = getDateOfIsoWeek(this.startAtWeek + 1, this.year);
		let dateIdx = 0;

		if (this.month - 1 == startOn.getMonth()) dateIdx = startOn.getDate();

		const days = new Date(this.year, this.month, dateIdx).getDate();
		const year = this.daysInYear();
		this.width = (days / year) * 100;
	}

	private daysInYear() {
		const startOn = getDateOfIsoWeek(this.startAtWeek + 1, this.year);
		return differenceInCalendarDays(new Date(this.year, 12, 0), startOn);
	}
}
