import { TestBed } from '@angular/core/testing';

import { FutureService } from './future.service';

describe('FutureService', () => {
  let service: FutureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FutureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
