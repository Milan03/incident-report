import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportShell } from './report-shell';

describe('ReportShell', () => {
  let component: ReportShell;
  let fixture: ComponentFixture<ReportShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
