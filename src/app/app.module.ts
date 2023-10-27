import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		AppComponent,
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
	bootstrap: [AppComponent],
})
export class AppModule {}
