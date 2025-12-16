import { Injectable } from '@angular/core';
import { IncidentReportDraftV1 } from '../models/report.model';

const STORAGE_KEY = 'incident_report_draft_v1';

@Injectable({ providedIn: 'root' })
export class DraftStoreService {
    load(): IncidentReportDraftV1 | null {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw) as IncidentReportDraftV1;
            if (parsed?.schemaVersion !== 1) {
                return null;
            }
            return parsed;
        } catch {
            return null;
        }
    }

    save(draft: IncidentReportDraftV1): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }

    clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    exists(): boolean {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }
}
