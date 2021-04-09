import {
  Component,
  EventEmitter, Inject,
  Input,
  OnChanges,
  OnInit, Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import {Subject} from 'rxjs';
import {Facet, FacetValue, IFilterFacet, ISearchFilter} from './facets';
import {map, takeUntil, tap} from 'rxjs/operators';
import {IFacetFilterFieldTemplateConfig} from './facet-filter-field-template-config';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldConfig} from 'common-form-elements';
import {SearchResultFacetFormConfigAdapter} from './search-result-facet-form-config-adapter';
import {PLATFORM_TOKEN} from './injection-tokens';
import {BaseSearchFilterComponent} from './base-search-filter.component';

@Component({
  selector: 'sb-search-facet-filter',
  template: `
    <sb-form *ngIf="formConfig"
             [platform]="platform"
             [fieldTemplateClass]="'normalize'"
             [config]="formConfig"
             (valueChanges)="onFilterChange($event)"
             (initialize)="onFormInitialize($event)">
    </sb-form>
  `,
  styles: [],
  providers: [SearchResultFacetFormConfigAdapter]
})
export class SbSearchFacetFilterComponent extends BaseSearchFilterComponent implements OnInit, OnChanges {
  private static readonly DEFAULT_SUPPORTED_FILTER_ATTRIBUTES = [];

  @Input() readonly supportedFilterAttributes: Facet[] = SbSearchFacetFilterComponent.DEFAULT_SUPPORTED_FILTER_ATTRIBUTES;
  @Input() readonly searchResultFacets: IFilterFacet[] = [];
  @Input() readonly baseSearchFilter: ISearchFilter = {};
  @Input() readonly filterFormTemplateConfig: IFacetFilterFieldTemplateConfig[] = [];
  @Output() searchFilterChange: EventEmitter<ISearchFilter> = new EventEmitter<ISearchFilter>();

  protected unsubscribe$ = new Subject<void>();

  public currentFilter?: ISearchFilter;
  public formConfig?: FieldConfig<FacetValue>[];

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    private searchResultFacetFormConfigAdapter: SearchResultFacetFormConfigAdapter,
    @Optional() @Inject(PLATFORM_TOKEN) public platform: string = 'web'
  ) {
    super(router, activatedRoute);
  }

  ngOnChanges(changes: SimpleChanges) {
    const newSearchResultFacetsValue: IFilterFacet[] = changes.searchResultFacets && changes.searchResultFacets.currentValue;
    if (newSearchResultFacetsValue) {
      this.formConfig = this.searchResultFacetFormConfigAdapter.map(
        newSearchResultFacetsValue,
        this.filterFormTemplateConfig,
        this.currentFilter,
      );
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        map(this.buildAggregatedSearchFilter.bind(this)),
        tap(this.saveOnResetSearchFilter.bind(this)),
        tap(this.updateCurrentFilter.bind(this)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
  }
}
