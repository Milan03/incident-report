import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ReportStateService } from '../../services/report-state.service';

@Component({
    selector: 'app-step-prepared-by',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './step-prepared-by.html',
    styleUrl: './step-prepared-by.scss',
})
export class StepPreparedByComponent {
    private readonly state = inject(ReportStateService);

    preparedByGroup = computed(
        () => this.state.form.get('preparedBy') as FormGroup
    );

    get g(): FormGroup {
        return this.preparedByGroup();
    }
}
