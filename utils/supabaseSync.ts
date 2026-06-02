import type { Spot } from "../types/spot";
import type { SpotReport } from "../types/report";

type SyncPayload = {
  userSpots: Spot[];
  reports: SpotReport[];
};

type SyncResult = {
  enabled: boolean;
  syncedReports: string[];
  syncedSpotIds: string[];
  error?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

async function postRows(table: string, rows: unknown[]) {
  if (!supabaseUrl || !supabaseAnonKey || rows.length === 0) {
    return;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(`Supabase ${table} sync failed: ${response.status}`);
  }
}

export async function syncLocalChanges(payload: SyncPayload): Promise<SyncResult> {
  if (!isSupabaseConfigured()) {
    return { enabled: false, syncedReports: [], syncedSpotIds: [] };
  }

  const unsyncedReports = payload.reports.filter((report) => !report.synced);
  const userSpots = payload.userSpots.filter((spot) => spot.id.startsWith("user-"));

  try {
    await postRows(
      "spots",
      userSpots.map((spot) => ({
        id: spot.id,
        name: spot.name,
        category: spot.category,
        description: spot.description,
        note: spot.note,
        tags: spot.tags,
        hours: spot.hours,
        payment: spot.payment,
        inside_station: spot.insideStation,
        verified: spot.verified ?? false,
        last_checked: spot.lastChecked ?? null,
        lat: spot.lat,
        lng: spot.lng,
        source: "user",
        status: "pending_review",
      }))
    );

    await postRows(
      "spot_reports",
      unsyncedReports.map((report) => ({
        id: report.id,
        spot_id: report.spotId,
        spot_name: report.spotName,
        type: report.type,
        details: report.details,
        created_at: report.createdAt,
      }))
    );

    return {
      enabled: true,
      syncedReports: unsyncedReports.map((report) => report.id),
      syncedSpotIds: userSpots.map((spot) => spot.id),
    };
  } catch (error) {
    return {
      enabled: true,
      syncedReports: [],
      syncedSpotIds: [],
      error: error instanceof Error ? error.message : "Sync failed",
    };
  }
}

export async function fetchApprovedRemoteSpots(): Promise<Spot[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const params = new URLSearchParams({
    status: "eq.active",
    select: "*",
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/spots?${params.toString()}`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase spot fetch failed: ${response.status}`);
  }

  const rows = (await response.json()) as Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    note: string;
    tags: string[] | null;
    hours: string;
    payment: string;
    inside_station: boolean;
    verified: boolean | null;
    last_checked: string | null;
    lat: number;
    lng: number;
    status: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    note: row.note,
    tags: row.tags ?? [],
    hours: row.hours,
    payment: row.payment,
    insideStation: row.inside_station,
    verified: row.verified ?? false,
    lastChecked: row.last_checked ?? undefined,
    lat: row.lat,
    lng: row.lng,
  }));
}
