import {AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {Debounce} from 'lodash-decorators';
import {query} from 'src/app/helpers';

@Component({
    selector: 'calendar-activity',
    templateUrl: './calendar-activity.component.html',
    styleUrls: ['./calendar-activity.component.scss']
})
export class CalendarActivityComponent implements AfterViewInit {

    @Input() public activity: any;

    @Output() public onClick: EventEmitter<any> = new EventEmitter();

    // @HostBinding('style.height.px') public outerHeight?: number;

    constructor(
        private el: ElementRef
    ) {}

    ngAfterViewInit(): void {
        // this.updateDimensions();
        // setTimeout(()=> this.updateDimensions(), 100);
    }

    // @Debounce(500)
    // @HostListener('window:resize')
    // private updateDimensions() {
    //     this.outerHeight = this.getCssByAttr('clientHeight');
    // }

    @HostListener('click')
    private clicked() {
        this.onClick.emit(this.activity);
    }

    // private getCssByAttr(attr: string): number {
    //     let htmlElement = query('.activity-item', this.el.nativeElement);        
    //     let res = htmlElement?.[attr];
    //     return res;
    // }

}
