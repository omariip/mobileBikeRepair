import { TestBed } from '@angular/core/testing';

import { AuthGuardTechnician } from './auth-guard.service';


describe('AuthGuardTechnician', () => {
  let service: AuthGuardTechnician;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardTechnician);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
