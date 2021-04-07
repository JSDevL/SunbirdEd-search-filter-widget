import {Facet, FacetValue, IFilterFacet, ISearchFilter} from './facets';
import {FieldConfig, FieldConfigInputType} from 'common-form-elements';
import {IFilterFieldTemplateConfig} from './filter-config';

type ISearchResultsFacetsMap = {[facet in Facet]?: FacetValue[]};

export class SearchResultFacetFormConfigAdapter {
  map(
    searchResultFacets: IFilterFacet[],
    filterFormTemplateConfig: IFilterFieldTemplateConfig[],
    currentFilter?: ISearchFilter
  ): FieldConfig<FacetValue>[] {
    const searchResultsFacetsMap: ISearchResultsFacetsMap = searchResultFacets.reduce<{[facet in Facet]: FacetValue[]}>((acc, entry) => {
      acc[entry.name] = entry.values.map(v => v.name);
      return acc;
    }, {});

    return filterFormTemplateConfig.map<FieldConfig<FacetValue>>((config) => {
      const defaultValue: FacetValue | FacetValue[] = (() => {
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
        default: (config.multiple && Array.isArray(defaultValue)) ? defaultValue : (defaultValue && defaultValue[0]),
        templateOptions: {
          label: config.labelText,
          placeHolder: config.placeholderText,
          multiple: config.multiple,
          options: searchResultsFacetsMap[config.facet] ?
            searchResultsFacetsMap[config.facet].map((value) => ({ label: value, value })) :
            []
        }
      };
    });
  }
}
