import { TestBed } from '@angular/core/testing';

import { HttpLoaderService } from './http-loader.service';

describe('HttpLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpLoaderService = TestBed.get(HttpLoaderService);
    expect(service).toBeTruthy();
  });
});
