import {TestBed} from '@angular/core/testing';

import {SunbirdEdSearchFilterService} from './sunbird-ed-search-filter.service';

describe('SunbirdEdSearchFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SunbirdEdSearchFilterService = TestBed.get(SunbirdEdSearchFilterService);
    expect(service).toBeTruthy();
  });
});
