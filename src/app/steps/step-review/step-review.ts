import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ReportStateService } from '../../services/report-state.service';

type IncidentType =
    | 'Injury'
    | 'PropertyDamage'
    | 'NearMiss'
    | 'BehaviouralIssue'
    | 'SafetyConcern'
    | 'Other';

@Component({
    selector: 'app-step-review',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './step-review.html',
    styleUrl: './step-review.scss',
})
export class StepReviewComponent {
    private readonly state = inject(ReportStateService);

    incident = computed(() => this.state.form.get('incident') as FormGroup);
    immediate = computed(
        () => this.state.form.get('immediateActions') as FormGroup
    );
    preparedBy = computed(() => this.state.form.get('preparedBy') as FormGroup);

    people = computed(() => this.state.form.get('people') as FormArray);
    followUp = computed(
        () => this.state.form.get('followUpActions') as FormArray
    );

    getIncidentTypeLabel(value: string): string {
        const map: Record<IncidentType, string> = {
            Injury: 'Injury',
            PropertyDamage: 'Property damage',
            NearMiss: 'Near miss',
            BehaviouralIssue: 'Behavioural issue',
            SafetyConcern: 'Safety concern',
            Other: 'Other',
        };

        return (map as any)[value] ?? value ?? '';
    }

    asText(v: unknown): string {
        const s = (v ?? '').toString().trim();
        return s.length > 0 ? s : '—';
    }
}
