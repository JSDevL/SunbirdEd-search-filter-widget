import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SunbirdEdSearchFilterComponent} from './sunbird-ed-search-filter.component';

describe('SunbirdEdSearchFilterComponent', () => {
  let component: SunbirdEdSearchFilterComponent;
  let fixture: ComponentFixture<SunbirdEdSearchFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SunbirdEdSearchFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunbirdEdSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
