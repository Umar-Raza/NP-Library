import { createClient } from "@/lib/supabase/client";

// ---- Assign modal ke liye (id + naam) ----
export interface ReaderOption {
  id: string;
  fullName: string;
}

export async function getApprovedReaders(): Promise<ReaderOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "reader")
    .eq("status", "approved")
    .order("full_name");

  if (error) {
    console.error("getApprovedReaders error:", error.message);
    return [];
  }
  return (data ?? []).map((r) => ({ id: r.id, fullName: r.full_name }));
}

// ---- Requests page ke liye (poora profile) ----
export interface ReaderProfile {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string | null;
  status: "pending" | "approved";
  createdAt: string;
}

function mapProfile(r: any): ReaderProfile {
  return {
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    whatsapp: r.whatsapp ?? null,
    status: r.status,
    createdAt: r.created_at,
  };
}

// Pending requests
export async function getPendingReaders(): Promise<ReaderProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, whatsapp, status, created_at")
    .eq("role", "reader")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPendingReaders error:", error.message);
    throw new Error("Requests load nahi ho saki.");
  }
  return (data ?? []).map(mapProfile);
}

// Approved readers
export async function getApprovedReaderProfiles(): Promise<ReaderProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, whatsapp, status, created_at")
    .eq("role", "reader")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getApprovedReaderProfiles error:", error.message);
    throw new Error("Readers load nahi ho saki.");
  }
  return (data ?? []).map(mapProfile);
}

// Approve
export async function approveReader(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: "approved" })
    .eq("id", id);
  if (error) {
    console.error("approveReader error:", error.message);
    throw new Error("Approve nahi ho saka.");
  }
}

// Reject (profile delete)
export async function rejectReader(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) {
    console.error("rejectReader error:", error.message);
    throw new Error("Reject nahi ho saka.");
  }
}
