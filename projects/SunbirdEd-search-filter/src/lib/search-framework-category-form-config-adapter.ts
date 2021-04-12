import {FieldConfig, FieldConfigInputType} from 'common-form-elements';
import {CategoryTerm, FrameworkCategory} from '@project-sunbird/client-services/models';
import {IFrameworkCategoryFilterFieldTemplateConfig} from './framework-category-filter-field-template-config';
import {ISearchFrameworkAssociationsMap, ISearchFrameworkCategoryFilter} from './models/framework';
import {Injectable} from '@angular/core';
import {TitleCasePipe} from '@angular/common';

type CategoryTermName = CategoryTerm['name'];

@Injectable()
export class SearchFrameworkCategoryFormConfigAdapter {
  constructor(private titleCasePipe: TitleCasePipe) {}

  map(
    frameworkAssociationsMap: ISearchFrameworkAssociationsMap,
    filterFormTemplateConfig: IFrameworkCategoryFilterFieldTemplateConfig[],
    currentFilter?: ISearchFrameworkCategoryFilter
  ): FieldConfig<FrameworkCategory['code'], FieldConfigInputType.SELECT>[] {
    return filterFormTemplateConfig.map<FieldConfig<CategoryTermName>>((config) => {
      const selectedValue: CategoryTermName | CategoryTermName[] = (() => {
        if (currentFilter && currentFilter[config.category]) {
          if (Array.isArray(currentFilter[config.category])) {
            return (currentFilter[config.category] as CategoryTermName[]).filter((categoryTermName) => {
              return frameworkAssociationsMap[config.category].find((associationCategoryTermName) =>
                associationCategoryTermName === categoryTermName
              );
            });
          }

          return frameworkAssociationsMap[config.category].find((categoryTermName) =>
            categoryTermName === currentFilter[config.category]
          ) ?
            (currentFilter[config.category] as CategoryTermName) :
            undefined;
        }

        return undefined;
      })();

      return {
        code: config.category,
        type: FieldConfigInputType.SELECT,
        fieldName: config.category,
        default: (config.multiple && Array.isArray(selectedValue)) ? selectedValue : (selectedValue && selectedValue[0]),
        templateOptions: {
          inputTypeOptions: { type: config.type },
          label: config.labelText,
          placeHolder: config.placeholderText,
          multiple: config.multiple,
          options: frameworkAssociationsMap[config.category] ?
            frameworkAssociationsMap[config.category].map((value) => ({ label: this.titleCasePipe.transform(value), value })) :
            []
        }
      };
    });
  }
}
