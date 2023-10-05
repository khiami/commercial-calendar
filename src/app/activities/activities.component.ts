import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getISOWeeksInYear } from 'date-fns';
import { types } from './types.data';
import { triggerWindowResize } from '../helpers';

@Component({
  selector: 'calendar-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, AfterViewInit {

  public readonly seasons = [
    'Winter',
    'Spring',
    'Summer',
    'Autumn',
  ]
  public readonly months = [
    'January',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];  

  public readonly types = types;

  public year = new Date().getFullYear();
  public weeks = getISOWeeksInYear(new Date());

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }
  
  ngAfterViewInit(): void {
    
    // setTimeout(()=> this.cdr.markForCheck(), 200);
    triggerWindowResize()
  }


}
