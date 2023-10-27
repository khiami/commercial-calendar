import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarLayoutComponent } from './calendar-layout/calendar-layout.component';
import { CommercialCalendarRoutingModule } from './commercial-calendar-routing.module';
import { CommercialCalendarActivityComponent } from './commercial-calendar-activity/commercial-calendar-activity.component';
import { CommercialCalendarProductComponent } from './commercial-calendar-product/commercial-calendar-product.component';
import { MonthLengthComponent } from './month-length/month-length.component';
import { CommercialCalendarComponent } from './commercial-calendar.component';
import { CommercialCalendarZoomComponent } from './commercial-calendar-zoom/commercial-calendar-zoom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarToolbarComponent } from './calendar-toolbar/calendar-toolbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogsModule } from '@progress/kendo-angular-dialog';

import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { CheckOverlapDirective } from './directives/check-overlap.directive';
import { FallbackSourceDirective } from './directives/fallback-src.directive';
import { CssVarPipe } from '../pipes/css-var.pipe';
import { FindXPipe } from '../pipes/find-x.pipe';
import { Findxv2Pipe } from '../pipes/findxv2.pipe';
import { SafePipe } from '../pipes/safe.pipe';
import { CssVarDirective } from '../directives/css-var.directive';
import { ResizeElementDirective } from './directives/resize-element.directive';


@NgModule({
	declarations: [
		CalendarLayoutComponent,
		CommercialCalendarComponent,
		MonthLengthComponent,
		CommercialCalendarZoomComponent,
		CommercialCalendarActivityComponent,
		CommercialCalendarProductComponent,
		CalendarToolbarComponent,
		CheckOverlapDirective,
		FallbackSourceDirective,

		CssVarPipe,
		FindXPipe,
		Findxv2Pipe,
		SafePipe,
		CssVarDirective,
		ResizeElementDirective,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		CommercialCalendarRoutingModule,

		// DialogsModule,
		// FontAwesomeModule,

		// ButtonsModule,
		// IconsModule,
		// LabelModule,
		// InputsModule,
		// LayoutModule,
		// DropDownsModule,
	],
})
export class CommercialCalendarModule { }
