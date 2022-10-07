import { TestBed } from '@angular/core/testing';

import { AuthGuardCustomerGuard } from './auth-guard-customer.guard';

describe('AuthGuardCustomerGuard', () => {
  let guard: AuthGuardCustomerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuardCustomerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
