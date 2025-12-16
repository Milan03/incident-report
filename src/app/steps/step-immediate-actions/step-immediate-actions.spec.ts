import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepImmediateActions } from './step-immediate-actions';

describe('StepImmediateActions', () => {
  let component: StepImmediateActions;
  let fixture: ComponentFixture<StepImmediateActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepImmediateActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepImmediateActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
