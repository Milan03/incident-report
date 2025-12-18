import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPreparedBy } from './step-prepared-by';

describe('StepPreparedBy', () => {
  let component: StepPreparedBy;
  let fixture: ComponentFixture<StepPreparedBy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPreparedBy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepPreparedBy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
