import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'calendar-activity',
  templateUrl: './calendar-activity.component.html',
  styleUrls: ['./calendar-activity.component.scss']
})
export class CalendarActivityComponent implements OnInit, AfterViewInit {

  @Input() activity: any;
  @Input() width?: number;

  @Output() onUpdateHeight: EventEmitter<number> = new EventEmitter();
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
      this.onUpdateHeight.emit(this.el.nativeElement.clientHeight);
  }

  @HostBinding('click')
  private clicked() {
    this.onClick.emit(this.activity);
  }

}
