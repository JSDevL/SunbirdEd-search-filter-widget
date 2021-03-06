import {ModuleWithProviders, NgModule} from '@angular/core';
import {SbSearchFacetFilterComponent} from './sb-search-facet-filter.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CommonFormElementsModule} from 'common-form-elements';
import {PLATFORM_TOKEN} from './injection-tokens';
import {SbSearchFrameworkFilterComponent} from './sb-search-framework-filter.component';

@NgModule({
  declarations: [
    SbSearchFacetFilterComponent,
    SbSearchFrameworkFilterComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    CommonFormElementsModule
  ],
  exports: [
    SbSearchFacetFilterComponent,
    SbSearchFrameworkFilterComponent
  ]
})
export class SbSearchFilterModule {
  static forRoot(
    platform: 'mobile' | 'web'
  ): ModuleWithProviders {
    return {
      ngModule: SbSearchFilterModule,
      providers: [
        { provide: PLATFORM_TOKEN, useValue: platform }
      ]
    };
  }
}
