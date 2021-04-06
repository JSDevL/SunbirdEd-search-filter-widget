import {TestBed} from '@angular/core/testing';

import {SbSearchFilterService} from './sb-search-filter.service';

describe('SbSearchFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SbSearchFilterService = TestBed.get(SbSearchFilterService);
    expect(service).toBeTruthy();
  });
});
