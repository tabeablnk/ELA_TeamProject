import { TestBed } from '@angular/core/testing';

import { QuestiontemplatesService } from './questiontemplates.service';

describe('QuestiontemplatesService', () => {
  let service: QuestiontemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestiontemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
