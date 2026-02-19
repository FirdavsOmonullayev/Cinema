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
    let message: string | null = null;
    const clone = res.clone();
    const payload = await res.json().catch(() => null);
    if (payload && typeof payload === "object" && "message" in payload) {
      const msg = (payload as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim()) {
        message = msg;
      }
    }
    if (!message) {
      const text = await clone.text().catch(() => "");
      if (text.trim()) {
        message = text.trim().slice(0, 200);
      }
    }
    throw new Error(message ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}


