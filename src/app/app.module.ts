import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SbSearchFilterModule } from '@project-sunbird/search-filter-widget';
import { CommonFormElementsModule } from 'common-form-elements';
import { RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SbSearchFilterModule.forRoot('web'),
    CommonFormElementsModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
