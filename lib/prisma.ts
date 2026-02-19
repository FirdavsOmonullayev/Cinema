import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

type SelectShape = Record<string, boolean> | undefined;

function toFilePath(databaseUrl: string) {
  if (databaseUrl.startsWith("file:")) {
    const rel = databaseUrl.replace(/^file:/, "");
    return path.resolve(process.cwd(), rel);
  }
  return path.resolve(process.cwd(), "dev.db");
}

function applySelect<T extends Record<string, unknown>>(row: T | undefined, select: SelectShape) {
  if (!row) return null;
  if (!select) return row;
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(select)) {
    if (select[key]) result[key] = row[key];
  }
  return result;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
  id TEXT PRIMARY KEY,
  movieId TEXT NOT NULL,
  mediaType TEXT NOT NULL,
  value INTEGER NOT NULL,
  movieTitle TEXT,
  posterPath TEXT,
  year TEXT,
  platform TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  userId TEXT NOT NULL,
  UNIQUE(userId, movieId, mediaType)
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  movieId TEXT NOT NULL,
  mediaType TEXT NOT NULL,
  title TEXT NOT NULL,
  posterPath TEXT,
  year TEXT,
  platform TEXT,
  createdAt TEXT NOT NULL,
  userId TEXT NOT NULL,
  UNIQUE(userId, movieId, mediaType)
);

CREATE TABLE IF NOT EXISTS search_history (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  userId TEXT NOT NULL
);
`;

function ensureDirSafe(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

function initDb() {
  const requestedPath = toFilePath(process.env.DATABASE_URL ?? "file:./dev.db");
  const candidates = [
    requestedPath,
    path.resolve(process.cwd(), ".data", "dev.db"),
    path.resolve(os.tmpdir(), "global-cinema-platform", "dev.db"),
    ":memory:"
  ];

  let lastError: unknown = null;

  for (const candidate of candidates) {
    try {
      if (candidate !== ":memory:") {
        ensureDirSafe(path.dirname(candidate));
      }

      const db = new Database(candidate);
      try {
        db.pragma("journal_mode = WAL");
      } catch {
        // WAL might fail on read-only filesystems; continue with default mode.
      }
      db.exec(SCHEMA_SQL);

      if (candidate !== requestedPath) {
        const fallbackLabel = candidate === ":memory:" ? "in-memory sqlite" : candidate;
        console.warn(
          `SQLite fallback in use (${fallbackLabel}). Original path failed: ${requestedPath}`
        );
      }

      return db;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Unable to initialize sqlite database: ${getErrorMessage(lastError)}`);
}

const db = initDb();

function now() {
  return new Date().toISOString();
}

function id() {
  return crypto.randomUUID().replace(/-/g, "");
}

type WhereUnique = {
  userId_movieId_mediaType: {
    userId: string;
    movieId: string;
    mediaType: string;
  };
};

export const prisma = {
  user: {
    findUnique: async ({ where, select }: { where: { email?: string; id?: string }; select?: SelectShape }) => {
      const row = where.email
        ? db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").get(where.email)
        : db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").get(where.id);
      return applySelect(row as Record<string, unknown> | undefined, select);
    },
    create: async ({
      data
    }: {
      data: { email: string; name: string; passwordHash: string };
    }) => {
      const value = {
        id: id(),
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        createdAt: now(),
        updatedAt: now()
      };
      db.prepare(
        "INSERT INTO users (id, email, name, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(value.id, value.email, value.name, value.passwordHash, value.createdAt, value.updatedAt);
      return value;
    }
  },
  rating: {
    groupBy: async ({
      where
    }: {
      by: string[];
      _avg: { value: true };
      where: { OR: { movieId: string; mediaType: string }[] };
    }) => {
      const filters = where.OR ?? [];
      if (!filters.length) return [];
      const clauses = filters.map(() => "(movieId = ? AND mediaType = ?)").join(" OR ");
      const params = filters.flatMap((x) => [x.movieId, x.mediaType]);
      const rows = db
        .prepare(
          `SELECT movieId, mediaType, AVG(value) as avgValue FROM ratings WHERE ${clauses} GROUP BY movieId, mediaType`
        )
        .all(...params) as { movieId: string; mediaType: string; avgValue: number | null }[];
      return rows.map((r) => ({
        movieId: r.movieId,
        mediaType: r.mediaType,
        _avg: { value: r.avgValue }
      }));
    },
    aggregate: async ({ where }: { _avg: { value: true }; where: { movieId: string; mediaType: string } }) => {
      const row = db
        .prepare("SELECT AVG(value) as avgValue FROM ratings WHERE movieId = ? AND mediaType = ?")
        .get(where.movieId, where.mediaType) as { avgValue: number | null } | undefined;
      return { _avg: { value: row?.avgValue ?? null } };
    },
    count: async ({ where }: { where: { movieId: string; mediaType: string } }) => {
      const row = db
        .prepare("SELECT COUNT(*) as count FROM ratings WHERE movieId = ? AND mediaType = ?")
        .get(where.movieId, where.mediaType) as { count: number };
      return row.count;
    },
    findUnique: async ({ where }: { where: WhereUnique }) => {
      const k = where.userId_movieId_mediaType;
      const row = db
        .prepare("SELECT * FROM ratings WHERE userId = ? AND movieId = ? AND mediaType = ? LIMIT 1")
        .get(k.userId, k.movieId, k.mediaType);
      return (row as Record<string, unknown> | undefined) ?? null;
    },
    upsert: async ({
      where,
      update,
      create
    }: {
      where: WhereUnique;
      update: {
        value: number;
        movieTitle?: string;
        posterPath?: string | null;
        year?: string;
        platform?: string | null;
      };
      create: {
        userId: string;
        movieId: string;
        mediaType: string;
        value: number;
        movieTitle?: string;
        posterPath?: string | null;
        year?: string;
        platform?: string | null;
      };
    }) => {
      const k = where.userId_movieId_mediaType;
      const existing = db
        .prepare("SELECT id FROM ratings WHERE userId = ? AND movieId = ? AND mediaType = ? LIMIT 1")
        .get(k.userId, k.movieId, k.mediaType) as { id: string } | undefined;

      if (existing) {
        db.prepare(
          `
          UPDATE ratings
          SET value = ?, movieTitle = ?, posterPath = ?, year = ?, platform = ?, updatedAt = ?
          WHERE id = ?
          `
        ).run(
          update.value,
          update.movieTitle ?? null,
          update.posterPath ?? null,
          update.year ?? null,
          update.platform ?? null,
          now(),
          existing.id
        );
        return db.prepare("SELECT * FROM ratings WHERE id = ?").get(existing.id) as Record<string, unknown>;
      }

      const value = {
        id: id(),
        createdAt: now(),
        updatedAt: now(),
        ...create
      };
      db.prepare(
        `
        INSERT INTO ratings (id, movieId, mediaType, value, movieTitle, posterPath, year, platform, createdAt, updatedAt, userId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      ).run(
        value.id,
        value.movieId,
        value.mediaType,
        value.value,
        value.movieTitle ?? null,
        value.posterPath ?? null,
        value.year ?? null,
        value.platform ?? null,
        value.createdAt,
        value.updatedAt,
        value.userId
      );
      return db.prepare("SELECT * FROM ratings WHERE id = ?").get(value.id) as Record<string, unknown>;
    }
  },
  favorite: {
    findMany: async ({
      where,
      orderBy
    }: {
      where: { userId: string };
      orderBy: { createdAt: "desc" | "asc" };
    }) => {
      return db
        .prepare(
          `SELECT * FROM favorites WHERE userId = ? ORDER BY createdAt ${orderBy.createdAt === "desc" ? "DESC" : "ASC"}`
        )
        .all(where.userId) as Record<string, unknown>[];
    },
    upsert: async ({
      where,
      update,
      create
    }: {
      where: WhereUnique;
      update: {
        title: string;
        posterPath?: string | null;
        year?: string;
        platform?: string | null;
      };
      create: {
        userId: string;
        movieId: string;
        mediaType: string;
        title: string;
        posterPath?: string | null;
        year?: string;
        platform?: string | null;
      };
    }) => {
      const k = where.userId_movieId_mediaType;
      const existing = db
        .prepare("SELECT id FROM favorites WHERE userId = ? AND movieId = ? AND mediaType = ? LIMIT 1")
        .get(k.userId, k.movieId, k.mediaType) as { id: string } | undefined;
      if (existing) {
        db.prepare(
          "UPDATE favorites SET title = ?, posterPath = ?, year = ?, platform = ? WHERE id = ?"
        ).run(update.title, update.posterPath ?? null, update.year ?? null, update.platform ?? null, existing.id);
        return db.prepare("SELECT * FROM favorites WHERE id = ?").get(existing.id) as Record<string, unknown>;
      }
      const value = {
        id: id(),
        createdAt: now(),
        ...create
      };
      db.prepare(
        `
        INSERT INTO favorites (id, movieId, mediaType, title, posterPath, year, platform, createdAt, userId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      ).run(
        value.id,
        value.movieId,
        value.mediaType,
        value.title,
        value.posterPath ?? null,
        value.year ?? null,
        value.platform ?? null,
        value.createdAt,
        value.userId
      );
      return db.prepare("SELECT * FROM favorites WHERE id = ?").get(value.id) as Record<string, unknown>;
    },
    delete: async ({ where }: { where: WhereUnique }) => {
      const k = where.userId_movieId_mediaType;
      db.prepare("DELETE FROM favorites WHERE userId = ? AND movieId = ? AND mediaType = ?").run(
        k.userId,
        k.movieId,
        k.mediaType
      );
      return { count: 1 };
    }
  },
  searchHistory: {
    findMany: async ({
      where,
      orderBy,
      take
    }: {
      where: { userId: string };
      orderBy: { createdAt: "desc" | "asc" };
      take?: number;
    }) => {
      const limit = take ?? 20;
      return db
        .prepare(
          `SELECT * FROM search_history WHERE userId = ? ORDER BY createdAt ${
            orderBy.createdAt === "desc" ? "DESC" : "ASC"
          } LIMIT ?`
        )
        .all(where.userId, limit) as Record<string, unknown>[];
    },
    findFirst: async ({ where, orderBy }: { where: { userId: string }; orderBy: { createdAt: "desc" | "asc" } }) => {
      const row = db
        .prepare(
          `SELECT * FROM search_history WHERE userId = ? ORDER BY createdAt ${
            orderBy.createdAt === "desc" ? "DESC" : "ASC"
          } LIMIT 1`
        )
        .get(where.userId);
      return (row as Record<string, unknown> | undefined) ?? null;
    },
    create: async ({ data }: { data: { userId: string; query: string } }) => {
      const value = {
        id: id(),
        userId: data.userId,
        query: data.query,
        createdAt: now()
      };
      db.prepare("INSERT INTO search_history (id, query, createdAt, userId) VALUES (?, ?, ?, ?)").run(
        value.id,
        value.query,
        value.createdAt,
        value.userId
      );
      return value;
    }
  }
} as const;
