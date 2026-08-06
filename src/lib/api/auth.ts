import { createClient } from "@/lib/supabase/client";

// SIGNUP — naya reader
export async function signUp(params: {
  fullName: string;
  email: string;
  whatsapp: string;
  password: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        whatsapp: params.whatsapp,
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

// LOGIN
export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

// Current user ka profile (role/status pata karne ke liye)
export async function getMyProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, whatsapp, avatar_url, role, status")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("getMyProfile error:", error.message);
    return null;
  }
  return data;
}

// LOGOUT
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

// FORGOT PASSWORD — reset email bhejta hai
export async function sendPasswordReset(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(error.message);
}

// Profile update (full name)
export async function updateMyProfile(
  fullName: string,
  avatarUrl?: string,
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User Not Logged In!");

  const updateData: { full_name: string; avatar_url?: string } = {
    full_name: fullName,
  };
  if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error("updateMyProfile error:", error.message);
    throw new Error("Profile Update Failed!");
  }
}
