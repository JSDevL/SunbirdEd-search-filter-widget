import {Facet, FacetValue, IFilterFacet} from './models/facets';
import {FieldConfig, FieldConfigInputType} from 'common-form-elements';
import {IFacetFilterFieldTemplateConfig} from './facet-filter-field-template-config';
import {ISearchFilter} from './models/search-filter';
import {Injectable} from '@angular/core';
import {TitleCasePipe} from '@angular/common';

type ISearchResultsFacetsMap = {[facet in Facet]?: FacetValue[]};

@Injectable()
export class SearchResultFacetFormConfigAdapter {
  constructor(private titleCasePipe: TitleCasePipe) {}

  map(
    searchResultFacets: IFilterFacet[],
    filterFormTemplateConfig: IFacetFilterFieldTemplateConfig[],
    currentFilter?: ISearchFilter<Facet, FacetValue>
  ): FieldConfig<FacetValue, FieldConfigInputType.SELECT>[] {
    const searchResultsFacetsMap: ISearchResultsFacetsMap = searchResultFacets.reduce<{[facet in Facet]: FacetValue[]}>((acc, entry) => {
      acc[entry.name] = entry.values.map(v => v.name);
      return acc;
    }, {});

    return filterFormTemplateConfig.map<FieldConfig<FacetValue>>((config) => {
      const selectedValue: FacetValue | FacetValue[] = (() => {
        if (currentFilter && currentFilter[config.facet]) {
          if (Array.isArray(currentFilter[config.facet])) {
            return (currentFilter[config.facet] as FacetValue[]).filter((filterFacetValue) => {
              return searchResultsFacetsMap[config.facet].find((searchResultsFacetValue) =>
                searchResultsFacetValue === filterFacetValue
              );
            });
          }

          return searchResultsFacetsMap[config.facet].find((searchResultsFacetValue) =>
            searchResultsFacetValue === currentFilter[config.facet]
          ) ?
            currentFilter[config.facet] :
            undefined;
        }

        return undefined;
      })();

      return {
        code: config.facet,
        type: FieldConfigInputType.SELECT,
        fieldName: config.facet,
        default: (config.multiple && Array.isArray(selectedValue)) ? selectedValue : (selectedValue && selectedValue[0]),
        templateOptions: {
          inputTypeOptions: { type: config.type },
          label: config.labelText,
          placeHolder: config.placeholderText,
          multiple: config.multiple,
          options: searchResultsFacetsMap[config.facet] ?
            searchResultsFacetsMap[config.facet].map((value) => ({ label: this.titleCasePipe.transform(value), value })) :
            []
        }
      };
    });
  }
}
