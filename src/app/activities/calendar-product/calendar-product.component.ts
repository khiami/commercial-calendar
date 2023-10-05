import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'calendar-product',
  templateUrl: './calendar-product.component.html',
  styleUrls: ['./calendar-product.component.scss']
})
export class CalendarProductComponent implements OnInit {

  @Input() product?: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
