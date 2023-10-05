import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ActivitiesComponent } from './activities/activities.component';

const routes: Routes = [
  {
    path: 'calendar',
    component: ActivitiesComponent,
  },
  {
    path: '**',
    redirectTo: 'calendar',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
