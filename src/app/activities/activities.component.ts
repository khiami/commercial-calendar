import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getISOWeeksInYear } from 'date-fns';
import { types } from './types.data';
import { triggerWindowResize } from '../helpers';
import { data } from './activities.data';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'calendar-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, AfterViewInit {

  private data: any[] = data;
  public activities?: any[];
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
    private cdr: ChangeDetectorRef,
    // private route: ActivatedRoute
  ) { }

  async ngOnInit() {

    // let {id} = this.route.snapshot.params??{};
    // let calendar = data.find(a=> a.id == +id);
    this.activities = data;

  }
  
  ngAfterViewInit(): void {
    
    triggerWindowResize();
  }

  public activityClicked(item: any) {
    console.log('activityClicked ', item);
  }


}
