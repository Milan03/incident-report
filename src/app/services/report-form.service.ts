import { Injectable } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { IncidentReportDraftV1, IncidentType } from '../models/report.model';

function guid(): string {
    // good enough for MVP (no backend)
    return (crypto as any).randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

@Injectable({ providedIn: 'root' })
export class ReportFormService {
    constructor(private fb: FormBuilder) { }

    createEmptyDraft(): IncidentReportDraftV1 {
        const now = new Date().toISOString();
        return {
            schemaVersion: 1,
            draftId: guid(),
            updatedAtUtc: now,
            incident: {
                date: '',
                time: '',
                location: '',
                type: 'Other',
                description: '',
            },
            people: [
                { name: '', role: '', injuryInvolved: false, notes: '' },
            ],
            immediateActions: { taken: '' },
            followUpActions: [
                { description: '', owner: '', targetDate: '' },
            ],
            preparedBy: { name: '', datePreparedUtc: now },
        };
    }

    buildForm(draft?: IncidentReportDraftV1): FormGroup {
        const d = draft ?? this.createEmptyDraft();

        return this.fb.group({
            schemaVersion: new FormControl(1, { nonNullable: true }),
            draftId: new FormControl(d.draftId, { nonNullable: true }),
            updatedAtUtc: new FormControl(d.updatedAtUtc, { nonNullable: true }),

            incident: this.fb.group({
                date: [d.incident.date, Validators.required],
                time: [d.incident.time, Validators.required],
                location: [d.incident.location, [Validators.required, Validators.maxLength(200)]],
                type: [d.incident.type as IncidentType, Validators.required],
                description: [d.incident.description, [Validators.required, Validators.maxLength(2000)]],
            }),

            people: this.fb.array(
                (d.people?.length ? d.people : [{ name: '', role: '', injuryInvolved: false }]).map(p =>
                    this.fb.group({
                        name: [p.name, [Validators.required, Validators.maxLength(120)]],
                        role: [p.role, [Validators.required, Validators.maxLength(120)]],
                        injuryInvolved: [!!p.injuryInvolved],
                        notes: [p.notes ?? '', Validators.maxLength(500)],
                    })
                )
            ),

            immediateActions: this.fb.group({
                taken: [d.immediateActions.taken, [Validators.required, Validators.maxLength(2000)]],
            }),

            followUpActions: this.fb.array(
                (d.followUpActions?.length ? d.followUpActions : [{ description: '', owner: '', targetDate: '' }]).map(a =>
                    this.fb.group({
                        description: [a.description, [Validators.required, Validators.maxLength(200)]],
                        owner: [a.owner, [Validators.required, Validators.maxLength(120)]],
                        targetDate: [a.targetDate, Validators.required],
                    })
                )
            ),

            preparedBy: this.fb.group({
                name: [d.preparedBy.name, [Validators.required, Validators.maxLength(120)]],
                datePreparedUtc: [d.preparedBy.datePreparedUtc],
            }),
        });
    }

    toDraft(form: FormGroup): IncidentReportDraftV1 {
        const value = form.getRawValue() as IncidentReportDraftV1;
        return {
            ...value,
            schemaVersion: 1,
            updatedAtUtc: new Date().toISOString(),
            preparedBy: {
                ...value.preparedBy,
                datePreparedUtc: value.preparedBy?.datePreparedUtc || new Date().toISOString(),
            },
        };
    }

    // helpers for arrays
    peopleArray(form: FormGroup): FormArray {
        return form.get('people') as FormArray;
    }

    followUpArray(form: FormGroup): FormArray {
        return form.get('followUpActions') as FormArray;
    }

    addPerson(form: FormGroup): void {
        this.peopleArray(form).push(
            this.fb.group({
                name: ['', [Validators.required, Validators.maxLength(120)]],
                role: ['', [Validators.required, Validators.maxLength(120)]],
                injuryInvolved: [false],
                notes: ['', Validators.maxLength(500)],
            })
        );
    }

    removePerson(form: FormGroup, index: number): void {
        const arr = this.peopleArray(form);
        if (arr.length <= 1) return;
        arr.removeAt(index);
    }

    addFollowUp(form: FormGroup): void {
        this.followUpArray(form).push(
            this.fb.group({
                description: ['', [Validators.required, Validators.maxLength(200)]],
                owner: ['', [Validators.required, Validators.maxLength(120)]],
                targetDate: ['', Validators.required],
            })
        );
    }

    removeFollowUp(form: FormGroup, index: number): void {
        const arr = this.followUpArray(form);
        if (arr.length <= 1) return;
        arr.removeAt(index);
    }
}
