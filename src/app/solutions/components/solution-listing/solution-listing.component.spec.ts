import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionListingComponent } from './solution-listing.component';

describe('SolutionListingComponent', () => {
  let component: SolutionListingComponent;
  let fixture: ComponentFixture<SolutionListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
