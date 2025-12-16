import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';

import { DraftStoreService } from './draft-store.service';
import { ReportFormService } from './report-form.service';
import { IncidentReportDraftV1 } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportStateService {
    private readonly destroy$ = new Subject<void>();

    form!: FormGroup;
    hasDraft = false;
    savingText = 'Saved';

    constructor(
        private drafts: DraftStoreService,
        private forms: ReportFormService
    ) { }

    init(): void {
        if (this.form) return; // already initialized

        const existing = this.drafts.load();
        this.hasDraft = !!existing;
        this.form = this.forms.buildForm(existing ?? undefined);

        // autosave
        this.form.valueChanges
            .pipe(debounceTime(800))
            .subscribe(() => {
                this.savingText = 'Saving...';
                const draft = this.forms.toDraft(this.form);
                this.drafts.save(draft);
                this.hasDraft = true;
                this.savingText = 'Saved';
            });
    }

    resumeDraft(): void {
        const d = this.drafts.load();
        if (!d) return;
        // keep same FormGroup instance: patch values instead of replacing
        this.form.reset(this.forms.buildForm(d).getRawValue());
        this.hasDraft = true;
    }

    startNew(): void {
        this.drafts.clear();
        const empty: IncidentReportDraftV1 = this.forms.createEmptyDraft();
        this.form.reset(this.forms.buildForm(empty).getRawValue());
        this.hasDraft = false;
        this.savingText = 'Saved';
    }

    clearDraft(): void {
        this.drafts.clear();
        this.hasDraft = false;
        this.savingText = 'Saved';
    }
}
