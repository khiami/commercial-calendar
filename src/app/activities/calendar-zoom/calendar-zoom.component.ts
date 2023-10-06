import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { cap } from 'src/app/helpers';

@Component({
  selector: 'calendar-zoom',
  templateUrl: './calendar-zoom.component.html',
  styleUrls: ['./calendar-zoom.component.scss']
})
export class CalendarZoomComponent implements OnInit, OnDestroy {

  @Input() level?: number;

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  public range?: FormControl;
  private destroy$: Subject<void>;

  public readonly min: number = 1;
  public readonly max: number = 15;

  constructor() {
    this.destroy$ = new Subject();
   }

  ngOnInit(): void {

    this.range = new FormControl(this.level??0);
    this.range.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value=> {

      value = cap(value, this.min, this.max);
      this.range?.patchValue(value, { emitEvent: false });
      this.onChange.emit(value);
    });    
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  public updateValue(diff: number): void {
    let value = this.range?.value ?? this.level ?? 0;
    // value = cap(value, 0, 10);
    this.range?.patchValue(value += diff);
  }

}
