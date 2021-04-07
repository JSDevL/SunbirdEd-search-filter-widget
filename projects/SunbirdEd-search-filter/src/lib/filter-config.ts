import {Facet} from './facets';

export interface IFilterFieldTemplateConfig {
  facet: Facet;
  labelText: string;
  placeholderText: string;
  multiple: boolean;
}
