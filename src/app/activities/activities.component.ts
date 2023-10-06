import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getISOWeeksInYear } from 'date-fns';
import { types } from './types.data';
import { triggerWindowResize } from '../helpers';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  public activities?: any[];
  public types?: any[];

  public year = new Date().getFullYear();
  public weeks = getISOWeeksInYear(new Date());

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    // private route: ActivatedRoute
  ) { }

  async ngOnInit() {

    // TODO remove when sync with warroom
    this.loadTypes();
    this.loadData();

  }
  
  ngAfterViewInit(): void {
    triggerWindowResize();
  }

  private async loadTypes() {
    let res: any = await this.http.get('http://localhost:4200/api/commercial-calendar-activity-types/', { 
      observe: 'body',
    }).toPromise();

    this.types = res;
  }

  private async loadData() {

    // TODO remove when sync with warroom
    let res: any = await this.http.get('http://localhost:4200/api/commercial-calendar-activities/?filter=calendarId||$eq||1', { 
      observe: 'body',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBlY2NvY3AuY29tIiwicm9sZXMiOlsxLDI0XSwiaWF0IjoxNjk2NTgyMDgwLCJleHAiOjE2OTY2Njg0ODB9.RHxtkiiKgfUtKFrnws9DpR5aOl5NNyirt-ENWtjLarg',
      }
    }).toPromise();

    this.activities = res;
    triggerWindowResize();
  }

  public activityClicked(item: any) {
    console.log('activityClicked ', item);
  }

}
