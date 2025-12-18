import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

import { ReportStateService } from '../../services/report-state.service';

@Component({
    selector: 'app-step-incident',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './step-incident.html',
    styleUrl: './step-incident.scss',
})
export class StepIncidentComponent {
    state = inject(ReportStateService);

    incidentGroup = computed(
        () => this.state.form.get('incident') as FormGroup
    );

    incidentTypes = [
        { value: 'Injury', label: 'Injury' },
        { value: 'PropertyDamage', label: 'Property damage' },
        { value: 'NearMiss', label: 'Near miss' },
        { value: 'BehaviouralIssue', label: 'Behavioural issue' },
        { value: 'SafetyConcern', label: 'Safety concern' },
        { value: 'Other', label: 'Other' },
    ] as const;

    get g(): FormGroup {
        return this.incidentGroup();
    }
}
