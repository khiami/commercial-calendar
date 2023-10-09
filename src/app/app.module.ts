import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities/activities.component';
import { CalendarActivityComponent } from './activities/calendar-activity/calendar-activity.component';
import { CalendarProductComponent } from './activities/calendar-product/calendar-product.component';
import { CssVarDirective } from './directives/css-var.directive';
import { FindXPipe } from './pipes/find-x.pipe';
import { CssVarPipe } from './pipes/css-var.pipe';
import {HttpClientModule} from '@angular/common/http';
import { Findxv2Pipe } from './pipes/findxv2.pipe';
import { CalendarZoomComponent } from './activities/calendar-zoom/calendar-zoom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafePipe } from './pipes/safe.pipe';
import { MonthLengthComponent } from './activities/month-length/month-length.component';

@NgModule({
  declarations: [
    AppComponent,
    ActivitiesComponent,
    MonthLengthComponent,
    CalendarActivityComponent,
    CalendarProductComponent,
    CalendarZoomComponent,

    CssVarDirective,
    FindXPipe,
    CssVarPipe,
    Findxv2Pipe,
    SafePipe,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,

    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
