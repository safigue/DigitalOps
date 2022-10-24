import { TestBed, inject } from '@angular/core/testing';

import { SharepointService } from './sharepoint.service';

describe('SharepointService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharepointService]
    });
  });

  it('should be created', inject([SharepointService], (service: SharepointService) => {
    expect(service).toBeTruthy();
  }));
});
