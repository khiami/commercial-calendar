import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'calendar-activity',
    templateUrl: './calendar-activity.component.html',
    styleUrls: ['./calendar-activity.component.scss']
})
export class CalendarActivityComponent {

    @Input() public activity: any;
    @Input() public colSize!: number;

    @Output() public onClick: EventEmitter<any> = new EventEmitter();

}
