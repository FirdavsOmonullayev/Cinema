"use client";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cinema_token");
}

export function saveToken(token: string) {
  localStorage.setItem("cinema_token", token);
}

export function clearToken() {
  localStorage.removeItem("cinema_token");
}

export async function fetchApi<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.message ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}


