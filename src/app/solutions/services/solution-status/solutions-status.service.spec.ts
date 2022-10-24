import { TestBed } from '@angular/core/testing';

import { SolutionsStatusService } from './solutions-status.service';

describe('SolutionsStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SolutionsStatusService = TestBed.get(SolutionsStatusService);
    expect(service).toBeTruthy();
  });
});
