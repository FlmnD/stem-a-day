import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";
const ACCESS_COOKIE_MAX_AGE_SECONDS = 60 * 60;
const REFRESH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type SessionTokens = {
    access_token: string;
    refresh_token: string;
};

export type SessionFetchResult = {
    response: Response | null;
    data: unknown;
    refreshedTokens: SessionTokens | null;
    refreshAttempted: boolean;
};

type BackendFetchOptions = Omit<RequestInit, "headers"> & {
    headers?: HeadersInit;
};

function asRecord(data: unknown): Record<string, unknown> | null {
    return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : null;
}

async function readJsonSafe(response: Response): Promise<unknown> {
    return response.json().catch(() => ({}));
}

async function requestSessionRefresh(refreshToken: string): Promise<SessionTokens | null> {
    const response = await fetch(`${process.env.FASTAPI_INTERNAL_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    const data = asRecord(await readJsonSafe(response));
    if (
        typeof data?.access_token !== "string" ||
        typeof data?.refresh_token !== "string"
    ) {
        return null;
    }

    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
    };
}

export async function fetchBackendWithSession(
    path: string,
    init: BackendFetchOptions = {}
): Promise<SessionFetchResult> {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value ?? null;
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
    let refreshedTokens: SessionTokens | null = null;
    let refreshAttempted = false;

    async function callBackend(token: string) {
        const headers = new Headers(init.headers);
        headers.set("Authorization", `Bearer ${token}`);
        return fetch(`${process.env.FASTAPI_INTERNAL_URL}${path}`, {
            ...init,
            headers,
            cache: init.cache ?? "no-store",
        });
    }

    if (!accessToken && refreshToken) {
        refreshAttempted = true;
        refreshedTokens = await requestSessionRefresh(refreshToken);
        accessToken = refreshedTokens?.access_token ?? null;
    }

    if (!accessToken) {
        return {
            response: null,
            data: { message: "Not logged in" },
            refreshedTokens,
            refreshAttempted,
        };
    }

    let response = await callBackend(accessToken);
    let data = await readJsonSafe(response);

    if (response.status === 401 && refreshToken) {
        refreshAttempted = true;
        const renewedTokens = await requestSessionRefresh(refreshToken);
        if (renewedTokens) {
            refreshedTokens = renewedTokens;
            response = await callBackend(renewedTokens.access_token);
            data = await readJsonSafe(response);
        }
    }

    return { response, data, refreshedTokens, refreshAttempted };
}

export function applySessionCookies(res: NextResponse, tokens: SessionTokens) {
    res.cookies.set(ACCESS_COOKIE_NAME, tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS,
    });

    res.cookies.set(REFRESH_COOKIE_NAME, tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
    });
}

export function clearSessionCookies(res: NextResponse) {
    res.cookies.set(ACCESS_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    res.cookies.set(REFRESH_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}
