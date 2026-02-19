import { NextRequest } from "next/server";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function shorten(value: string, max = 42) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
}

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("mode") === "backdrop" ? "backdrop" : "poster";
  const rawTitle = req.nextUrl.searchParams.get("title")?.trim() || "Global Cinema";
  const title = escapeXml(shorten(rawTitle, mode === "backdrop" ? 64 : 36));

  const width = mode === "backdrop" ? 1600 : 600;
  const height = mode === "backdrop" ? 900 : 900;
  const titleY = mode === "backdrop" ? 520 : 500;
  const subY = mode === "backdrop" ? 580 : 560;
  const titleSize = mode === "backdrop" ? 64 : 44;
  const subSize = mode === "backdrop" ? 32 : 28;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="50%" stop-color="#172554"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.2" cy="0.2" r="1">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#00000000"/>
      <stop offset="100%" stop-color="#000000a0"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect y="${Math.floor(height * 0.64)}" width="100%" height="${Math.ceil(height * 0.36)}" fill="url(#fade)"/>

  <g opacity="0.9">
    <circle cx="${Math.floor(width * 0.16)}" cy="${Math.floor(height * 0.18)}" r="${Math.floor(height * 0.06)}" fill="#ffffff12"/>
    <circle cx="${Math.floor(width * 0.84)}" cy="${Math.floor(height * 0.22)}" r="${Math.floor(height * 0.04)}" fill="#ffffff10"/>
  </g>

  <text x="50%" y="${titleY}" text-anchor="middle" fill="#f8fafc" font-size="${titleSize}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-weight="700">
    ${title}
  </text>
  <text x="50%" y="${subY}" text-anchor="middle" fill="#cbd5e1" font-size="${subSize}" font-family="system-ui, -apple-system, Segoe UI, sans-serif">
    Global Cinema
  </text>
</svg>`.trim();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400"
    }
  });
}
