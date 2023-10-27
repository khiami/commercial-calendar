import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
	{
		path: '',
		component: AppComponent,
		children: [
			{
				path: 'commercial-calendar',
				loadChildren: ()=> import('./commercial-calendar/commercial-calendar.module').then((m)=> m.CommercialCalendarModule),
			},
		]
	},
	{
		path: '**',
		redirectTo: 'commercial-calendar/1',
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
