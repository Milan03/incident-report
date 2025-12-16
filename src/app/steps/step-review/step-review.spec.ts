import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepReview } from './step-review';

describe('StepReview', () => {
  let component: StepReview;
  let fixture: ComponentFixture<StepReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepReview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
