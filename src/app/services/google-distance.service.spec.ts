import { TestBed } from '@angular/core/testing';

import { GoogleDistanceService } from './google-distance.service';

describe('GoogleDistanceService', () => {
  let service: GoogleDistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleDistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
