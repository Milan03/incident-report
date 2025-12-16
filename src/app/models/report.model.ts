export type IncidentType =
    | 'Injury'
    | 'PropertyDamage'
    | 'NearMiss'
    | 'BehaviouralIssue'
    | 'SafetyConcern'
    | 'Other';

export interface PersonInvolved {
    name: string;
    role: string;
    injuryInvolved: boolean;
    notes?: string;
}

export interface FollowUpAction {
    description: string;
    owner: string;
    targetDate: string; // yyyy-mm-dd
}

export interface IncidentReportDraftV1 {
    schemaVersion: 1;
    draftId: string;
    updatedAtUtc: string;

    incident: {
        date: string;      // yyyy-mm-dd
        time: string;      // HH:mm
        location: string;
        type: IncidentType;
        description: string;
    };

    people: PersonInvolved[];

    immediateActions: {
        taken: string;
    };

    followUpActions: FollowUpAction[];

    preparedBy: {
        name: string;
        datePreparedUtc: string; // auto
    };
}
