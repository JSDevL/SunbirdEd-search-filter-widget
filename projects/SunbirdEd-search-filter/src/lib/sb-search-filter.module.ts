import {NgModule} from '@angular/core';
import {SbSearchFacetFilterComponent} from './sb-search-facet-filter.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CommonFormElementsModule} from 'common-form-elements';


@NgModule({
  declarations: [SbSearchFacetFilterComponent],
  imports: [
    RouterModule,
    CommonModule,
    CommonFormElementsModule
  ],
  exports: [SbSearchFacetFilterComponent]
})
export class SbSearchFilterModule {
}
