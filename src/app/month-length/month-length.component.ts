import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'month-length',
  templateUrl: './month-length.component.html',
  styleUrls: ['./month-length.component.scss']
})
export class MonthLengthComponent implements OnInit {

  @Input() month!: number;
  @Input() year!: number;

  @HostBinding('style.width.%') width?: number;

  ngOnInit() {
    let days = this.getDaysInMonth(this.year, this.month);
    let year = this.daysInYear(this.year);
    this.width = days/year * 100;
  }


  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  };

  private daysInYear(year: number) {
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
  }
}
