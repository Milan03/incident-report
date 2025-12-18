import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notBeforeToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const raw = control.value as string | null | undefined;
        if (!raw) return null;

        // Expecting yyyy-mm-dd from <input type="date">
        const parts = raw.split('-').map((x) => parseInt(x, 10));
        if (parts.length !== 3 || parts.some((n) => Number.isNaN(n)))
            return null;

        const [year, month, day] = parts;

        // Local midnight to avoid timezone edge cases
        const selected = new Date(year, month - 1, day);
        const now = new Date();
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        return selected < today ? { notBeforeToday: true } : null;
    };
}
