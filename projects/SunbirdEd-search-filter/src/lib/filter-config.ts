import {Facet} from './facets';

export interface IFilterFieldTemplateConfig {
  index: number;
  facet: Facet;
  labelText: string;
  defaultSelectionText: string;
  zeroSelectionText: string;
  multiple: boolean;
}
