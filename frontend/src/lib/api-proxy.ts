type ProxyFetchResult = {
    data: unknown;
    errorMessage: string | null;
    response: Response | null;
};

function getApiBaseUrl(): string | null {
    const baseUrl = process.env.FASTAPI_INTERNAL_URL?.trim();
    if (!baseUrl) return null;
    return baseUrl.replace(/\/+$/, "");
}

export async function fetchApiJson(
    path: string,
    init: RequestInit
): Promise<ProxyFetchResult> {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
        console.error("FASTAPI_INTERNAL_URL is not configured for the web service.");
        return {
            response: null,
            data: {},
            errorMessage:
                "The web service is missing FASTAPI_INTERNAL_URL. Add the internal api URL in Railway and redeploy.",
        };
    }

    try {
        const response = await fetch(`${baseUrl}${path}`, init);
        const data = await response.json().catch(() => ({}));
        return { response, data, errorMessage: null };
    } catch (error) {
        console.error(`Failed to reach upstream API at ${baseUrl}${path}`, error);
        return {
            response: null,
            data: {},
            errorMessage:
                "The web service could not reach the api service. Check FASTAPI_INTERNAL_URL and confirm the api deployment is healthy.",
        };
    }
}
