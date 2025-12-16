import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepIncident } from './step-incident';

describe('SetpIncident', () => {
  let component: StepIncident;
  let fixture: ComponentFixture<StepIncident>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepIncident]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepIncident);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
