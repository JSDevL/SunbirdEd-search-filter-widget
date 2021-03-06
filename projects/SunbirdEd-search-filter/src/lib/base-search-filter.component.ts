import {ActivatedRoute, Router} from '@angular/router';
import {EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {Facet, FacetValue} from './models/facets';
import {FieldConfig} from 'common-form-elements';
import {cloneDeep, isEqual} from 'lodash-es';
import {ISearchFilter} from './models/search-filter';

type IAnySearchFilter = ISearchFilter<any, any>;

export abstract class BaseSearchFilterComponent implements OnInit, OnChanges, OnDestroy {
  public supportedFilterAttributes: string[];
  public baseSearchFilter: IAnySearchFilter = {};
  public searchFilterChange: EventEmitter<IAnySearchFilter> = new EventEmitter<IAnySearchFilter>();

  private formGroup?: FormGroup;
  private onResetSearchFilter?: IAnySearchFilter;

  protected abstract isFieldMultipleSelectMap: {[field: string]: boolean};
  protected unsubscribe$ = new Subject<void>();

  public currentFilter?: IAnySearchFilter;
  public formConfig?: FieldConfig<any>[];

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
  ) {
  }

  abstract ngOnChanges(changes: SimpleChanges): void;

  abstract ngOnInit(): void;

  onFilterChange(searchFilter: IAnySearchFilter) {
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

  protected updateCurrentFilter(searchFilter: IAnySearchFilter) {
    if (!isEqual(this.currentFilter, searchFilter)) {
      this.currentFilter = searchFilter;
      this.searchFilterChange.emit(this.currentFilter);
    }
  }

  protected updateQueryParams(searchFilter: IAnySearchFilter) {
    this.router.navigate([], {
      queryParams: {
        ...(() => {
          const queryParams = cloneDeep(this.activatedRoute.snapshot.queryParams);

          if (this.supportedFilterAttributes && this.supportedFilterAttributes.length) {
            this.supportedFilterAttributes.forEach((attr) => delete queryParams[attr]);
            Object.keys(this.currentFilter).forEach((attr) => delete queryParams[attr]);
            return queryParams;
          }

          Object.keys(this.currentFilter).forEach((attr) => delete queryParams[attr]);
          return queryParams;
        })(),
        ...searchFilter
      },
      relativeTo: this.activatedRoute.parent
    });
  }

  protected saveOnResetSearchFilter(aggregatedSearchFilter: IAnySearchFilter) {
    if (!this.onResetSearchFilter) {
      this.onResetSearchFilter = aggregatedSearchFilter;
    }
  }

  protected buildAggregatedSearchFilter(): IAnySearchFilter {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const aggregatedSearchFilter: IAnySearchFilter = cloneDeep(this.baseSearchFilter);

    Object.keys(queryParams)
      .filter((paramKey) => this.supportedFilterAttributes.length ? this.supportedFilterAttributes.includes(paramKey) : true)
      .forEach((facet: Facet) => {
        if (this.isFieldMultipleSelectMap[facet]) {
          if (aggregatedSearchFilter[facet]) {
            aggregatedSearchFilter[facet] = Array.from(new Set([
              ...(Array.isArray(aggregatedSearchFilter[facet]) ? aggregatedSearchFilter[facet] : [aggregatedSearchFilter[facet]]),
              ...(Array.isArray(queryParams[facet]) ? queryParams[facet] : [queryParams[facet]])
            ]));
          } else {
            aggregatedSearchFilter[facet] = Array.isArray(queryParams[facet]) ? queryParams[facet] : [queryParams[facet]];
          }
        } else {
          aggregatedSearchFilter[facet] = Array.isArray(queryParams[facet]) ? queryParams[facet][0] : queryParams[facet];
        }
      });

    return aggregatedSearchFilter;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
