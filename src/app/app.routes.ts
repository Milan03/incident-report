import { Routes } from '@angular/router';

import { ReportShellComponent } from './shell/report-shell/report-shell';
import { StepIncidentComponent } from './steps/step-incident/step-incident';
import { StepPeopleComponent } from './steps/step-people/step-people';
import { StepImmediateActionsComponent } from './steps/step-immediate-actions/step-immediate-actions';
import { StepFollowUpActionsComponent } from './steps/step-follow-up-actions/step-follow-up-actions';
import { StepReviewComponent } from './steps/step-review/step-review';

export const routes: Routes = [
  {
    path: '',
    component: ReportShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'incident' },
      { path: 'incident', component: StepIncidentComponent },
      { path: 'people', component: StepPeopleComponent },
      { path: 'immediate-actions', component: StepImmediateActionsComponent },
      { path: 'follow-up-actions', component: StepFollowUpActionsComponent },
      { path: 'review', component: StepReviewComponent },
    ],
  },
  { path: '**', redirectTo: 'incident' },
];
