import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPeople } from './step-people';

describe('StepPeople', () => {
  let component: StepPeople;
  let fixture: ComponentFixture<StepPeople>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepPeople]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepPeople);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
