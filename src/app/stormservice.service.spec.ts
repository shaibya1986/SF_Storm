import { TestBed } from '@angular/core/testing';

import { StormserviceService } from './stormservice.service';

describe('StormserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StormserviceService = TestBed.get(StormserviceService);
    expect(service).toBeTruthy();
  });
});
