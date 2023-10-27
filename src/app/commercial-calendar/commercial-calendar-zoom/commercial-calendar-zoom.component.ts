import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { cap } from 'src/app/helpers';

@Component({
	selector: 'commercial-calendar-zoom',
	templateUrl: './commercial-calendar-zoom.component.html',
	styleUrls: ['./commercial-calendar-zoom.component.scss'],
})
export class CommercialCalendarZoomComponent implements OnInit {
	@Input() public level?: number;
	@Input() public min: number = 0;
	@Input() public max: number = 10;

	@Output() public onChange: EventEmitter<any> = new EventEmitter();
	@Output() public onFullyOut: EventEmitter<any> = new EventEmitter();

	public range?: FormControl;
	public zoomLevel: number = 0;

	ngOnInit(): void {
		if (this.level) {
			this.zoomLevel = this.level;
		}
	}

	public updateZoom(diff: number): void {
		this.zoomLevel += diff;
		this.zoomLevel = cap(this.zoomLevel, this.min, this.max);
		this.onChange.emit(this.zoomLevel);
	}
}
