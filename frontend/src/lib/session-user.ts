export type SessionUser = {
    id: number;
    email: string;
    username?: string | null;
    streak: number;
    glucose: number;
    is_email_verified: boolean;
    created_at: string;
    updated_at: string;
    last_login: string;
    plants: string[];
};

function asRecord(data: unknown): Record<string, unknown> | null {
    return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : null;
}

function asStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function asSessionUser(data: unknown): SessionUser | null {
    const record = asRecord(data);
    if (!record) return null;

    if (
        typeof record.id !== "number" ||
        typeof record.email !== "string" ||
        typeof record.streak !== "number" ||
        typeof record.glucose !== "number" ||
        typeof record.is_email_verified !== "boolean" ||
        typeof record.created_at !== "string" ||
        typeof record.updated_at !== "string" ||
        typeof record.last_login !== "string"
    ) {
        return null;
    }

    return {
        id: record.id,
        email: record.email,
        username:
            typeof record.username === "string" || record.username === null
                ? record.username
                : null,
        streak: record.streak,
        glucose: record.glucose,
        is_email_verified: record.is_email_verified,
        created_at: record.created_at,
        updated_at: record.updated_at,
        last_login: record.last_login,
        plants: asStringArray(record.plants),
    };
}
