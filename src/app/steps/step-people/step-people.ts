import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ReportStateService } from '../../services/report-state.service';
import { ReportFormService } from '../../services/report-form.service';

@Component({
    selector: 'app-step-people',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './step-people.html',
    styleUrl: './step-people.scss',
})
export class StepPeopleComponent {
    state = inject(ReportStateService);
    forms = inject(ReportFormService);

    peopleArray = computed(() => this.state.form.get('people') as FormArray);

    personGroupAt(i: number): FormGroup {
        return this.peopleArray().at(i) as FormGroup;
    }

    add(): void {
        this.forms.addPerson(this.state.form);
    }

    remove(i: number): void {
        this.forms.removePerson(this.state.form, i);
    }
}
