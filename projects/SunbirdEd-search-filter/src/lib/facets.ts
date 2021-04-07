export type Facet = string;
export type FacetValue = string;

export interface IFilterFacet {
  name: Facet;
  values: IFilterFacetValue[];
}

export interface IFilterFacetValue {
  name: FacetValue;
  count: string;
}

export type ISearchFilter = { [key in Facet]: FacetValue[] | FacetValue };
