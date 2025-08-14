import supabase from "./supabase";

export interface UrlRow {
  custom_url: string | null;
  id: number;
  original_url: string;
  qr: string;
  short_url: string;
  title: string;
  user_id: string;
  created_at: string;
}

export async function getUrls(user_id: string): Promise<UrlRow[]> {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load URLs");
  }

  return (data ?? []) as UrlRow[];
}
