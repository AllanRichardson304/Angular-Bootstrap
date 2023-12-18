import { TestBed } from '@angular/core/testing';

import { PinlockGuard } from './pinlock.guard';

describe('PinlockGuard', () => {
  let guard: PinlockGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PinlockGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
