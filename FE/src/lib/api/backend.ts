export const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? "/api/backend";

export async function fetchBackendJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BACKEND_API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
