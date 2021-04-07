import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {Facet, FacetValue, IFilterFacet, ISearchFilter} from './facets';
import {distinctUntilChanged, map, takeUntil, tap} from 'rxjs/operators';
import {IFilterFieldTemplateConfig} from './filter-config';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'sb-search-filter',
  template: `
    <ng-container *ngIf="searchResultFacetsMap">
      <ng-container *ngFor="let config of filterFormTemplateConfig">
        <ng-container *ngTemplateOutlet="filterFieldTemplate; context: {
            templateConfig: config,
            allFilterValues: (searchResultFacetsMap[config.facet] || []),
            selectedFilterValues: currentFilter[config.facet]
        }"></ng-container>
      </ng-container>
    </ng-container>
  `,
  styles: []
})
export class SbSearchFilterComponent implements OnInit, OnChanges, OnDestroy {
  private static readonly DEFAULT_SUPPORTED_FILTER_ATTRIBUTES = ['se_boards', 'se_mediums', 'se_gradeLevels', 'se_subjects', 'channel', 'audience', 'publisher'];

  @Input() readonly filterFieldTemplate = TemplateRef;
  @Input() readonly supportedFilterAttributes: Facet[] = SbSearchFilterComponent.DEFAULT_SUPPORTED_FILTER_ATTRIBUTES;
  @Input() readonly searchResultFacets: IFilterFacet[] = [];
  @Input() readonly baseSearchFilter: ISearchFilter = {};
  @Input() readonly filterFormTemplateConfig: IFilterFieldTemplateConfig[] = [];
  @Output() searchFilterChange: EventEmitter<ISearchFilter> = new EventEmitter<ISearchFilter>();

  private onResetSearchFilter?: ISearchFilter;
  private unsubscribe$ = new Subject<void>();

  public searchResultFacetsMap: {[facet in Facet]: FacetValue[]} = {};
  public currentFilter?: ISearchFilter;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const newSearchResultFacetsValue: IFilterFacet[] = changes.searchResultFacets && changes.searchResultFacets.currentValue;
    if (newSearchResultFacetsValue) {
      this.searchResultFacetsMap = newSearchResultFacetsValue.reduce<{[facet in Facet]: FacetValue[]}>((acc, entry) => {
        acc[entry.name] = entry.values.map(v => v.name);
        return acc;
      }, {});
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        distinctUntilChanged((a , b) => JSON.stringify(a) === JSON.stringify(b)),
        map(this.buildAggregatedSearchFilter.bind(this)),
        tap(this.saveOnResetSearchFilter.bind(this)),
        tap(this.updateCurrentFilter.bind(this)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((v: ISearchFilter) => {
        this.searchFilterChange.emit(v);
      });
  }

  onFilterChange(facet: Facet, values: FacetValue[]) {
    const aggregatedSearchFilter = this.buildAggregatedSearchFilter();
    aggregatedSearchFilter[facet] = values;
    this.updateQueryParams(aggregatedSearchFilter);
  }

  resetFilter() {
    if (this.onResetSearchFilter) {
      this.updateQueryParams(this.onResetSearchFilter);
    }
  }

  private updateCurrentFilter(searchFilter: ISearchFilter) {
    this.currentFilter = searchFilter;
    this.searchFilterChange.emit(searchFilter);
  }

  private updateQueryParams(searchFilter: ISearchFilter) {
    this.router.navigate([], {
      queryParams: {
        ...(() => {
          const queryParams = JSON.parse(JSON.stringify(this.activatedRoute.snapshot.queryParams));
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
    const aggregatedSearchFilter: ISearchFilter = JSON.parse(JSON.stringify(this.baseSearchFilter));

    Object.keys(queryParams)
      .filter((paramKey) => this.supportedFilterAttributes.includes(paramKey))
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
          aggregatedSearchFilter[facet] = queryParams[facet];
        }
      });

    return aggregatedSearchFilter;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
