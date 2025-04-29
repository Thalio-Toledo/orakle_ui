import { TestBed } from '@angular/core/testing';

import { OwnerGuardService } from './owner-guard.service';

describe('OwnerGuardService', () => {
  let service: OwnerGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
