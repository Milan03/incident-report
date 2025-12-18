import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    Router,
    RouterLink,
    RouterOutlet,
    NavigationEnd,
} from '@angular/router';
import { ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';

import { ReportStateService } from '../../services/report-state.service';

import { filter } from 'rxjs';

type Step = { key: string; label: string; route: string };

@Component({
    selector: 'app-report-shell',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, ReactiveFormsModule],
    templateUrl: './report-shell.html',
    styleUrl: './report-shell.scss',
})
export class ReportShellComponent implements OnInit {
    private router = inject(Router);
    state = inject(ReportStateService);

    private readonly currentPath = signal<string>('');

    readonly steps: Step[] = [
        { key: 'incident', label: 'Incident', route: '/incident' },
        { key: 'people', label: 'People', route: '/people' },
        {
            key: 'immediate-actions',
            label: 'Immediate Actions',
            route: '/immediate-actions',
        },
        {
            key: 'follow-up-actions',
            label: 'Follow-up Actions',
            route: '/follow-up-actions',
        },
        { key: 'prepared-by', label: 'Prepared By', route: '/prepared-by' },
        { key: 'review', label: 'Review', route: '/review' },
    ];

    readonly currentIndex = computed(() => {
        const path = this.currentPath();
        const idx = this.steps.findIndex((s) => s.key === path);
        return idx >= 0 ? idx : 0;
    });

    ngOnInit(): void {
        this.state.init();

        this.router.events
            .pipe(filter((e) => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                const path = e.urlAfterRedirects
                    .replace(/^\//, '')
                    .split('/')[0];
                this.currentPath.set(path);
            });

        // initialize immediately (important on first load)
        const initial = this.router.url.replace(/^\//, '').split('/')[0];
        this.currentPath.set(initial);
    }

    resumeDraft(): void {
        this.state.resumeDraft();
    }

    startNew(): void {
        this.state.startNew();
        void this.router.navigateByUrl('/incident');
    }

    dismissDraftNotice(): void {
        this.state.dismissDraftNotice();
    }

    goTo(i: number): void {
        if (!this.canNavigateTo(i)) return;

        this.state.clearSavingStatus();

        const step = this.steps[i];
        if (!step) return;
        void this.router.navigateByUrl(step.route);
    }

    goBack(): void {
        this.state.clearSavingStatus();

        const i = this.currentIndex();
        if (i <= 0) return;
        this.goTo(i - 1);
    }

    goNext(): void {
        if (!this.canGoNext()) return;

        this.state.clearSavingStatus();

        const i = this.currentIndex();
        if (i >= this.steps.length - 1) return;
        this.goTo(i + 1);
    }

    private incidentGroup(): FormGroup {
        return this.state.form.get('incident') as FormGroup;
    }

    private peopleArray(): FormArray {
        return this.state.form.get('people') as FormArray;
    }

    private immediateActionsGroup(): FormGroup {
        return this.state.form.get('immediateActions') as FormGroup;
    }

    private followUpArray(): FormArray {
        return this.state.form.get('followUpActions') as FormArray;
    }

    private preparedByGroup(): FormArray {
        return this.state.form.get('preparedBy') as FormArray;
    }

    private isIncidentValid(): boolean {
        const g = this.incidentGroup();
        return g && g.valid;
    }

    private isPeopleValid(): boolean {
        const arr = this.peopleArray();
        if (!arr || arr.length < 1) return false;
        // array.valid already checks children, but we’ll be explicit:
        return arr.valid && arr.controls.every((c) => c.valid);
    }

    private isPreparedByValid(): boolean {
        const g = this.preparedByGroup();
        return g && g.valid;
    }

    private isImmediateActionsValid(): boolean {
        const g = this.immediateActionsGroup();
        return g && g.valid;
    }

    private isFollowUpValid(): boolean {
        const arr = this.followUpArray();
        if (!arr || arr.length < 1) return false;
        return arr.valid && arr.controls.every((c) => c.valid);
    }

    /** Step-by-step completion in order (cannot skip ahead). */
    private isStepComplete(stepKey: string): boolean {
        switch (stepKey) {
            case 'incident':
                return this.isIncidentValid();
            case 'people':
                return this.isIncidentValid() && this.isPeopleValid();
            case 'immediate-actions':
                return (
                    this.isIncidentValid() &&
                    this.isPeopleValid() &&
                    this.isImmediateActionsValid()
                );
            case 'follow-up-actions':
                return (
                    this.isIncidentValid() &&
                    this.isPeopleValid() &&
                    this.isImmediateActionsValid() &&
                    this.isFollowUpValid()
                );
            case 'prepared-by':
                return (
                    this.isIncidentValid() &&
                    this.isPeopleValid() &&
                    this.isImmediateActionsValid() &&
                    this.isFollowUpValid() &&
                    this.isPreparedByValid()
                );
            case 'review':
                return (
                    this.isIncidentValid() &&
                    this.isPeopleValid() &&
                    this.isImmediateActionsValid() &&
                    this.isPreparedByValid() &&
                    this.isFollowUpValid()
                );
            default:
                return false;
        }
    }

    /** Can user navigate to this step index? Backwards always allowed; forward only if prior steps complete. */
    canNavigateTo(index: number): boolean {
        const current = this.currentIndex();
        if (index <= current) return true; // always allow backward
        // to go to index N, the step at N-1 must be complete (which implies earlier ones are too)
        const prev = this.steps[index - 1];
        return !!prev && this.isStepComplete(prev.key);
    }

    /** Enable Next only if current step’s required form section is valid. */
    canGoNext(): boolean {
        const i = this.currentIndex();
        const key = this.steps[i]?.key;

        switch (key) {
            case 'incident':
                return this.isIncidentValid();
            case 'people':
                return this.isPeopleValid();
            case 'immediate-actions':
                return this.isImmediateActionsValid();
            case 'follow-up-actions':
                return this.isFollowUpValid();
            case 'prepared-by':
                return this.isPreparedByValid();
            case 'review':
                return false;
            default:
                return false;
        }
    }
}
