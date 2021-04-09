import {
  Component,
  EventEmitter,
  Inject,
  Input, OnChanges, OnInit,
  Optional,
  Output, SimpleChanges,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PLATFORM_TOKEN} from './injection-tokens';
import {Facet, ISearchFilter} from './facets';
import {BaseSearchFilterComponent} from './base-search-filter.component';

@Component({
  selector: 'sb-search-framework-filter',
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
  providers: []
})
export class SbSearchFrameworkFilterComponent extends BaseSearchFilterComponent implements OnInit, OnChanges {
  private static readonly DEFAULT_SUPPORTED_FILTER_ATTRIBUTES = ['board', 'medium', 'gradeLevel', 'subject'];

  @Input() readonly supportedFilterAttributes: Facet[] = SbSearchFrameworkFilterComponent.DEFAULT_SUPPORTED_FILTER_ATTRIBUTES;
  @Input() readonly baseSearchFilter: ISearchFilter = {};
  @Output() searchFilterChange: EventEmitter<ISearchFilter> = new EventEmitter<ISearchFilter>();

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    @Optional() @Inject(PLATFORM_TOKEN) public platform: string = 'web'
  ) {
    super(router, activatedRoute);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }
}
