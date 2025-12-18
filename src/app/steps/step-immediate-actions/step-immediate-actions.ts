import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ReportStateService } from '../../services/report-state.service';

@Component({
    selector: 'app-step-immediate-actions',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './step-immediate-actions.html',
    styleUrl: './step-immediate-actions.scss',
})
export class StepImmediateActionsComponent {
    private readonly state = inject(ReportStateService);

    immediateGroup = computed(
        () => this.state.form.get('immediateActions') as FormGroup
    );

    get g(): FormGroup {
        return this.immediateGroup();
    }
}
