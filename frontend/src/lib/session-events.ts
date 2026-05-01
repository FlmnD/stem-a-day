export const SESSION_USER_REFRESH_EVENT = "session-user-refresh";

export function requestSessionUserRefresh() {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(new Event(SESSION_USER_REFRESH_EVENT));
}
