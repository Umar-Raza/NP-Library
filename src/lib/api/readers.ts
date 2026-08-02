import { createClient } from "@/lib/supabase/client";

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
