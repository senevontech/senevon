import { supabase } from "./supabaseClient";

const clean = (v) => (typeof v === "string" ? v.trim() : v);

/** Contact (public) */
export async function submitContact({ name, email, phone, message }) {
  const payload = {
    type: "contact",
    name: clean(name),
    email: clean(email)?.toLowerCase(),
    phone: clean(phone) || null,
    message: clean(message),
  };

  if (!payload.name || !payload.email || !payload.message) {
    throw new Error("Name, Email and Message are required.");
  }

  const { error } = await supabase.from("submissions").insert(payload);
  if (error) throw new Error(error.message);

  return { success: true, message: "✅ Message received. We will contact you soon." };
}

/** Career (public) */
export async function submitCareer({ name, email, phone, role, portfolio, linkedin, resumeUrl, coverLetter }) {
  const payload = {
    type: "career",
    name: clean(name),
    email: clean(email)?.toLowerCase(),
    phone: clean(phone) || null,
    role: clean(role),
    portfolio: clean(portfolio) || null,
    linkedin: clean(linkedin) || null,
    resume_url: clean(resumeUrl) || null,
    cover_letter: clean(coverLetter) || null,
  };

  if (!payload.name || !payload.email || !payload.role) {
    throw new Error("Name, Email and Role are required.");
  }

  const { error } = await supabase.from("submissions").insert(payload);
  if (error) throw new Error(error.message);

  return { success: true, message: "✅ Application received. We will get back to you." };
}

/** Admin (requires auth + admins table membership) */
export async function fetchSubmissions(type = "all") {
  let q = supabase.from("submissions").select("*").order("created_at", { ascending: false }).limit(1000);
  if (type === "contact" || type === "career") q = q.eq("type", type);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteSubmission(id) {
  const { error } = await supabase.from("submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
