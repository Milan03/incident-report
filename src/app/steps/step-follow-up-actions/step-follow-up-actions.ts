import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ReportStateService } from '../../services/report-state.service';
import { ReportFormService } from '../../services/report-form.service';

@Component({
    selector: 'app-step-follow-up-actions',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './step-follow-up-actions.html',
    styleUrl: './step-follow-up-actions.scss',
})
export class StepFollowUpActionsComponent {
    private readonly state = inject(ReportStateService);
    private readonly forms = inject(ReportFormService);

    followUpArray = computed(
        () => this.state.form.get('followUpActions') as FormArray
    );

    actionGroupAt(i: number): FormGroup {
        return this.followUpArray().at(i) as FormGroup;
    }

    add(): void {
        this.forms.addFollowUp(this.state.form);
    }

    remove(i: number): void {
        this.forms.removeFollowUp(this.state.form, i);
    }
}
