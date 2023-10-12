import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'commercial-calendar-activity',
    templateUrl: './calendar-activity.component.html',
    styleUrls: ['./calendar-activity.component.scss']
})
export class CalendarActivityComponent {

    @Input() public activity: any;
    @Input() public colSize!: number;
    @Input() isNarrow: boolean = false;

    @Output() public onClick: EventEmitter<any> = new EventEmitter();

}
