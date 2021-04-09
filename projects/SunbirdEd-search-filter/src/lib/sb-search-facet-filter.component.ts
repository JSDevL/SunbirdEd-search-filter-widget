import {
  Component,
  EventEmitter, Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import {Subject} from 'rxjs';
import {Facet, FacetValue, IFilterFacet, ISearchFilter} from './facets';
import {map, takeUntil, tap} from 'rxjs/operators';
import {IFacetFilterFieldTemplateConfig} from './facet-filter-field-template-config';
import {ActivatedRoute, Router} from '@angular/router';
import {cloneDeep, isEqual} from 'lodash-es';
import {FieldConfig} from 'common-form-elements';
import {SearchResultFacetFormConfigAdapter} from './search-result-facet-form-config-adapter';
import {PLATFORM_TOKEN} from './injection-tokens';
import {FormGroup} from '@angular/forms';

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
export class SbSearchFacetFilterComponent implements OnInit, OnChanges, OnDestroy {
  private static readonly DEFAULT_SUPPORTED_FILTER_ATTRIBUTES = [];

  @Input() readonly supportedFilterAttributes: Facet[] = SbSearchFacetFilterComponent.DEFAULT_SUPPORTED_FILTER_ATTRIBUTES;
  @Input() readonly searchResultFacets: IFilterFacet[] = [];
  @Input() readonly baseSearchFilter: ISearchFilter = {};
  @Input() readonly filterFormTemplateConfig: IFacetFilterFieldTemplateConfig[] = [];
  @Output() searchFilterChange: EventEmitter<ISearchFilter> = new EventEmitter<ISearchFilter>();

  private formGroup?: FormGroup;
  private onResetSearchFilter?: ISearchFilter;
  private unsubscribe$ = new Subject<void>();

  public currentFilter?: ISearchFilter;
  public formConfig?: FieldConfig<FacetValue>[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchResultFacetFormConfigAdapter: SearchResultFacetFormConfigAdapter,
    @Optional() @Inject(PLATFORM_TOKEN) public platform: string = 'web'
  ) {}

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

  onFilterChange(searchFilter: ISearchFilter) {
    const aggregatedSearchFilter = {
      ...this.buildAggregatedSearchFilter(),
      ...searchFilter
    };
    this.updateQueryParams(aggregatedSearchFilter);
  }

  resetFilter() {
    if (this.onResetSearchFilter) {
      this.updateQueryParams(this.onResetSearchFilter);
    }
  }

  onFormInitialize(formGroup: FormGroup) {
    this.formGroup = formGroup;
    if (this.currentFilter) {
      this.formGroup.patchValue(this.currentFilter, { emitEvent: false });
    }
  }

  private updateCurrentFilter(searchFilter: ISearchFilter) {
    if (!isEqual(this.currentFilter, searchFilter)) {
      this.currentFilter = searchFilter;
      this.searchFilterChange.emit(this.currentFilter);
    }
  }

  private updateQueryParams(searchFilter: ISearchFilter) {
    this.router.navigate([], {
      queryParams: {
        ...(() => {
          const queryParams = cloneDeep(this.activatedRoute.snapshot.queryParams);
          this.supportedFilterAttributes.forEach((attr) => delete queryParams[attr]);
          return queryParams;
        })(),
        ...searchFilter
      },
      relativeTo: this.activatedRoute.parent
    });
  }

  private saveOnResetSearchFilter(aggregatedSearchFilter: ISearchFilter) {
    if (!this.onResetSearchFilter) {
      this.onResetSearchFilter = aggregatedSearchFilter;
    }
  }

  private buildAggregatedSearchFilter(): ISearchFilter {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const aggregatedSearchFilter: ISearchFilter = cloneDeep(this.baseSearchFilter);

    Object.keys(queryParams)
      .filter((paramKey) => this.supportedFilterAttributes.length ? this.supportedFilterAttributes.includes(paramKey) : true)
      .forEach((facet: Facet) => {
        if (aggregatedSearchFilter[facet]) {
          if (Array.isArray(aggregatedSearchFilter[facet])) {
            aggregatedSearchFilter[facet] = Array.from(new Set([
              ...aggregatedSearchFilter[facet] as FacetValue[],
              ...(Array.isArray(queryParams[facet]) ? queryParams[facet] : [queryParams[facet]])
            ]));
          } else {
            aggregatedSearchFilter[facet] = Array.from(new Set([
              aggregatedSearchFilter[facet] as FacetValue,
              ...(Array.isArray(queryParams[facet]) ? queryParams[facet] : [queryParams[facet]])
            ]));
          }
        } else {
          aggregatedSearchFilter[facet] = Array.isArray(queryParams[facet]) ? queryParams[facet] : [queryParams[facet]];
        }
      });

    return aggregatedSearchFilter;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
