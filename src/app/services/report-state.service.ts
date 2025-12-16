import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';

import { DraftStoreService } from './draft-store.service';
import { ReportFormService } from './report-form.service';
import { IncidentReportDraftV1 } from '../models/report.model';

const NOTICE_KEY = 'incident_report_notice_dismissed_v1';

@Injectable({ providedIn: 'root' })
export class ReportStateService {
    private readonly destroy$ = new Subject<void>();

    form!: FormGroup;
    hasDraft = false;
    hasAcknowledgedDraft = false;
    savingText = '';

    constructor(
        private drafts: DraftStoreService,
        private forms: ReportFormService
    ) { }

    init(): void {
        if (this.form) return;

        const existing = this.drafts.load();
        this.hasDraft = !!existing;
        const dismissed = sessionStorage.getItem(NOTICE_KEY) === '1';
        this.hasAcknowledgedDraft = dismissed || !existing;

        this.form = this.forms.buildForm(existing ?? undefined);

        this.form.valueChanges
            .pipe(debounceTime(800))
            .subscribe(() => {
                this.savingText = 'Saving...';
                this.drafts.save(this.forms.toDraft(this.form));
                this.hasDraft = true;
                this.savingText = 'All changes saved';
                setTimeout(() => {
                    if (this.savingText === 'All changes saved') {
                        this.clearSavingStatus();
                    }
                }, 2000);
            });
    }

    resumeDraft(): void {
        const d = this.drafts.load();
        if (!d) return;

        this.form.reset(this.forms.buildForm(d).getRawValue());
        this.hasDraft = true;
        this.hasAcknowledgedDraft = true;
    }

    startNew(): void {
        this.drafts.clear();
        const empty = this.forms.createEmptyDraft();
        this.form.reset(this.forms.buildForm(empty).getRawValue());
        this.hasDraft = false;
        this.hasAcknowledgedDraft = true;
        sessionStorage.setItem(NOTICE_KEY, '1');

        this.savingText = '';
    }

    dismissDraftNotice(): void {
        this.hasAcknowledgedDraft = true;
        sessionStorage.setItem(NOTICE_KEY, '1');
    }

    clearSavingStatus(): void {
        this.savingText = '';
    }

}
