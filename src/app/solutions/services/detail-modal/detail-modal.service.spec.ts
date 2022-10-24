import { TestBed } from '@angular/core/testing';

import { DetailModalService } from './detail-modal.service';

describe('DetailModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetailModalService = TestBed.get(DetailModalService);
    expect(service).toBeTruthy();
  });
});
