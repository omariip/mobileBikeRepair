import { TestBed } from '@angular/core/testing';

import { RememberSignInGuard } from './remember-sign-in.guard';

describe('RememberSignInGuard', () => {
  let guard: RememberSignInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RememberSignInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
