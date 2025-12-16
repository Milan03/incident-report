import { TestBed } from '@angular/core/testing';

import { DraftStoreService } from './draft-store.service';

describe('DraftStore', () => {
  let service: DraftStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DraftStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
