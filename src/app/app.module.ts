import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SbSearchFilterModule } from '@project-sunbird/search-filter-widget';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SbSearchFilterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
