import { createClient } from "@/lib/supabase/client";

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function getNotifications(): Promise<Notification[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, message, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("getNotifications error:", error.message);
    return [];
  }

  return (data ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    message: n.message,
    isRead: n.is_read,
    createdAt: n.created_at,
  }));
}

// Sab unread ko read mark karein
export async function markAllRead(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) console.error("markAllRead error:", error.message);
}
