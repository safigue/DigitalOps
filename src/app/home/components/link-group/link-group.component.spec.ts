import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkGroupComponent } from './link-group.component';

describe('LinkGroupComponent', () => {
  let component: LinkGroupComponent;
  let fixture: ComponentFixture<LinkGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
