import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
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
export class StepReviewComponent implements OnDestroy {
    private readonly state = inject(ReportStateService);

    private readonly toastFadeMs = 200; // must match CSS transition duration
    private toastHideTimer: number | null = null;
    private toastClearTimer: number | null = null;

    isCopying = false;

    toastText = signal('');
    toastKind = signal<'success' | 'error' | ''>('');
    toastVisible = signal(false);

    incident = computed(() => this.state.form.get('incident') as FormGroup);
    immediate = computed(
        () => this.state.form.get('immediateActions') as FormGroup
    );
    preparedBy = computed(() => this.state.form.get('preparedBy') as FormGroup);

    people = computed(() => this.state.form.get('people') as FormArray);
    followUp = computed(
        () => this.state.form.get('followUpActions') as FormArray
    );

    ngOnDestroy(): void {
        if (this.toastHideTimer !== null) {
            window.clearTimeout(this.toastHideTimer);
            this.toastHideTimer = null;
        }

        if (this.toastClearTimer !== null) {
            window.clearTimeout(this.toastClearTimer);
            this.toastClearTimer = null;
        }
    }

    getIncidentTypeLabel(value: string | null | undefined): string {
        const map: Record<IncidentType, string> = {
            Injury: 'Injury',
            PropertyDamage: 'Property damage',
            NearMiss: 'Near miss',
            BehaviouralIssue: 'Behavioural issue',
            SafetyConcern: 'Safety concern',
            Other: 'Other',
        };

        const key = (value ?? '') as IncidentType;
        return map[key] ?? value ?? '';
    }

    asText(v: unknown): string {
        const s = (v ?? '').toString().trim();
        return s.length > 0 ? s : '—';
    }

    async copySummary(): Promise<void> {
        if (this.isCopying) return;

        this.isCopying = true;

        try {
            const text = this.buildFullReportText();

            const ok = await this.copyToClipboard(text);
            if (ok) {
                this.showToast('Copied full report', 'success');
            } else {
                this.showToast('Copy failed. Please try again.', 'error', 2400);
            }
        } finally {
            this.isCopying = false;
        }
    }

    private buildFullReportText(): string {
        const incident = this.incident();
        const immediate = this.immediate();
        const preparedBy = this.preparedBy();

        const peopleArray = this.people();
        const followUpArray = this.followUp();

        const lines: string[] = [];

        lines.push('Incident Report');
        lines.push('='.repeat(14));
        lines.push('');

        lines.push('Incident');
        lines.push('-'.repeat(8));
        lines.push(`Date: ${this.asText(incident.get('date')?.value)}`);
        lines.push(`Time: ${this.asText(incident.get('time')?.value)}`);
        lines.push(`Location: ${this.asText(incident.get('location')?.value)}`);
        lines.push(
            `Type: ${this.getIncidentTypeLabel(incident.get('type')?.value)}`
        );
        lines.push('');
        lines.push('Description:');
        lines.push(this.asText(incident.get('description')?.value));
        lines.push('');

        lines.push('People Involved');
        lines.push('-'.repeat(15));

        if (peopleArray.length === 0) {
            lines.push('—');
            lines.push('');
        } else {
            peopleArray.controls.forEach((p, idx) => {
                const name = this.asText(p.get('name')?.value);
                const role = this.asText(p.get('role')?.value);
                const injury =
                    p.get('injuryInvolved')?.value === true ? 'Yes' : 'No';
                const notes = this.asText(p.get('notes')?.value);

                lines.push(`${idx + 1}. ${name}`);
                lines.push(`   Role: ${role}`);
                lines.push(`   Injury involved: ${injury}`);

                if (notes !== '—') {
                    lines.push('   Notes:');
                    lines.push(`   ${notes.replace(/\n/g, '\n   ')}`);
                }

                lines.push('');
            });
        }

        lines.push('Immediate Actions');
        lines.push('-'.repeat(17));
        lines.push(this.asText(immediate.get('taken')?.value));
        lines.push('');

        lines.push('Follow-up Actions');
        lines.push('-'.repeat(16));

        if (followUpArray.length === 0) {
            lines.push('—');
            lines.push('');
        } else {
            followUpArray.controls.forEach((a, idx) => {
                const desc = this.asText(a.get('description')?.value);
                const owner = this.asText(a.get('owner')?.value);
                const target = this.asText(a.get('targetDate')?.value);

                lines.push(`${idx + 1}. ${desc}`);
                lines.push(`   Owner: ${owner}`);
                lines.push(`   Target date: ${target}`);
                lines.push('');
            });
        }

        lines.push('Prepared By');
        lines.push('-'.repeat(11));
        lines.push(`Name: ${this.asText(preparedBy.get('name')?.value)}`);
        lines.push(`Email: ${this.asText(preparedBy.get('email')?.value)}`);
        lines.push(
            `Prepared at: ${this.asText(preparedBy.get('preparedAt')?.value)}`
        );
        lines.push('');

        return lines.join('\n');
    }

    private showToast(
        text: string,
        kind: 'success' | 'error',
        ms: number = 1600
    ): void {
        this.toastText.set(text);
        this.toastKind.set(kind);
        this.toastVisible.set(true);

        if (this.toastHideTimer !== null)
            window.clearTimeout(this.toastHideTimer);
        if (this.toastClearTimer !== null)
            window.clearTimeout(this.toastClearTimer);

        this.toastHideTimer = window.setTimeout(() => {
            this.toastVisible.set(false);

            this.toastClearTimer = window.setTimeout(() => {
                this.toastText.set('');
                this.toastKind.set('');
                this.toastHideTimer = null;
                this.toastClearTimer = null;
            }, this.toastFadeMs);
        }, ms);
    }

    private async copyToClipboard(text: string): Promise<boolean> {
        try {
            if (
                !navigator.clipboard ||
                typeof navigator.clipboard.writeText !== 'function'
            ) {
                return false;
            }

            await this.withTimeout(navigator.clipboard.writeText(text), 900);
            return true;
        } catch {
            return false;
        }
    }

    private withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const id = window.setTimeout(
                () => reject(new Error('timeout')),
                ms
            );

            p.then((x) => {
                window.clearTimeout(id);
                resolve(x);
            }).catch((err) => {
                window.clearTimeout(id);
                reject(err);
            });
        });
    }
}
