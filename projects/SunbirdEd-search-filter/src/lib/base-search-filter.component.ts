import {ActivatedRoute, Router} from '@angular/router';
import {EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {Facet, FacetValue, ISearchFilter} from './facets';
import {FieldConfig} from 'common-form-elements';
import {cloneDeep, isEqual} from 'lodash-es';

export abstract class BaseSearchFilterComponent implements OnInit, OnChanges, OnDestroy {
  public supportedFilterAttributes: string[];
  public baseSearchFilter: ISearchFilter = {};
  public searchFilterChange: EventEmitter<ISearchFilter> = new EventEmitter<ISearchFilter>();

  private formGroup?: FormGroup;
  private onResetSearchFilter?: ISearchFilter;
  protected unsubscribe$ = new Subject<void>();

  public currentFilter?: ISearchFilter;
  public formConfig?: FieldConfig<any>[];

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
  ) {
  }

  abstract ngOnChanges(changes: SimpleChanges): void;

  abstract ngOnInit(): void;

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

  protected updateCurrentFilter(searchFilter: ISearchFilter) {
    if (!isEqual(this.currentFilter, searchFilter)) {
      this.currentFilter = searchFilter;
      this.searchFilterChange.emit(this.currentFilter);
    }
  }

  protected updateQueryParams(searchFilter: ISearchFilter) {
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

  protected saveOnResetSearchFilter(aggregatedSearchFilter: ISearchFilter) {
    if (!this.onResetSearchFilter) {
      this.onResetSearchFilter = aggregatedSearchFilter;
    }
  }

  protected buildAggregatedSearchFilter(): ISearchFilter {
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
