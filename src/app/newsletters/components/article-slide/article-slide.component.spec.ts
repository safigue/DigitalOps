import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSlideComponent } from './article-slide.component';

describe('ArticleSlideComponent', () => {
  let component: ArticleSlideComponent;
  let fixture: ComponentFixture<ArticleSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
