import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'calendar-product',
  templateUrl: './calendar-product.component.html',
  styleUrls: ['./calendar-product.component.scss']
})
export class CalendarProductComponent implements OnInit {

  @Input() product?: any;
  @Input() colSize!: number;
  
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('click')
  private productClicked() {
    this.onClick.emit(this.product);
  }

}
