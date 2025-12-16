import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFollowUpActions } from './step-follow-up-actions';

describe('StepFollowUpActions', () => {
  let component: StepFollowUpActions;
  let fixture: ComponentFixture<StepFollowUpActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepFollowUpActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepFollowUpActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
