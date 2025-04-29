import { TestBed } from '@angular/core/testing';

import { ArtefactService } from './artefact.service';

describe('DocumentService', () => {
  let service: ArtefactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtefactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
