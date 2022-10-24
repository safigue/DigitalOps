import { TestBed } from '@angular/core/testing';

import { HttpLoaderInterceptService } from './http-loader-intercept.service';

describe('HttpLoaderInterceptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpLoaderInterceptService = TestBed.get(HttpLoaderInterceptService);
    expect(service).toBeTruthy();
  });
});
