import { TestBed } from '@angular/core/testing';

import { ArticleModalService } from './article-modal.service';

describe('ArticleModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArticleModalService = TestBed.get(ArticleModalService);
    expect(service).toBeTruthy();
  });
});
