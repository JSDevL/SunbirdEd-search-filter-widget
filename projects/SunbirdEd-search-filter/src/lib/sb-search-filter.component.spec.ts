import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SbSearchFilterComponent} from './sb-search-filter.component';

describe('SbSearchFilterComponent', () => {
  let component: SbSearchFilterComponent;
  let fixture: ComponentFixture<SbSearchFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SbSearchFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
