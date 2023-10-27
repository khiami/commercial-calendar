import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarLayoutComponent } from './calendar-layout/calendar-layout.component';
import { CommercialCalendarComponent } from './commercial-calendar.component';

const routes: Routes = [
	{
		path: '',
		component: CalendarLayoutComponent,
		children: [
			{ path: ':id', component: CommercialCalendarComponent },
			{ path: '**', redirectTo: '', pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CommercialCalendarRoutingModule {}
