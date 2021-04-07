import {NgModule} from '@angular/core';
import {SbSearchFilterComponent} from './sb-search-filter.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [SbSearchFilterComponent],
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [SbSearchFilterComponent]
})
export class SbSearchFilterModule {
}
