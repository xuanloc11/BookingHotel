export const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "/api/backend";

const SERVER_BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ??
  `${process.env.BACKEND_ORIGIN ?? "http://127.0.0.1:8000"}/api`;

export class BackendApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "BackendApiError";
  }
}

interface BackendFetchOptions extends Omit<RequestInit, "body"> {
  authToken?: string;
  body?: unknown;
}

function getBackendUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof window === "undefined") {
    const publicBase = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
    const serverBase =
      publicBase && /^https?:\/\//i.test(publicBase)
        ? publicBase
        : SERVER_BACKEND_API_BASE_URL;

    return `${serverBase}${normalizedPath}`;
  }

  return `${BACKEND_API_BASE_URL}${normalizedPath}`;
}

function readBrowserCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : null;
}

function isJsonBody(body: unknown): boolean {
  return (
    body !== undefined &&
    body !== null &&
    typeof body !== "string" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob)
  );
}

async function parseErrorDetails(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => null);
}

export async function fetchBackendJson<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<T> {
  const { authToken, body, headers: inputHeaders, ...requestOptions } = options;
  const headers = new Headers(inputHeaders);

  headers.set("Accept", "application/json");

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const csrfToken = readBrowserCookie("csrftoken");
  if (csrfToken && !headers.has("X-CSRFToken")) {
    headers.set("X-CSRFToken", csrfToken);
  }

  const requestBody = isJsonBody(body) ? JSON.stringify(body) : (body as BodyInit);
  if (isJsonBody(body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const currency = localStorage.getItem("app_currency") || "VND";
    const language = localStorage.getItem("app_language") || "vi";
    if (!headers.has("X-Currency")) headers.set("X-Currency", currency);
    if (!headers.has("Accept-Language")) headers.set("Accept-Language", language);
  }

  const response = await fetch(getBackendUrl(path), {
    cache: "no-store",
    credentials: "include",
    ...requestOptions,
    body: requestBody,
    headers,
  });

  if (!response.ok) {
    const details = await parseErrorDetails(response);
    throw new BackendApiError(
      `Backend request failed: ${response.status}`,
      response.status,
      details,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
