import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities/activities.component';
import { MonthLengthComponent } from './month-length/month-length.component';
import { CssVarDirective } from './directives/css-var.directive';

@NgModule({
  declarations: [
    AppComponent,
    ActivitiesComponent,
    MonthLengthComponent,

    CssVarDirective,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
