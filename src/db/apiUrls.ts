import supabase, { supabaseUrl } from "./supabase";

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

export interface CreateUrl {
  title: string;
  longUrl: string;
  customUrl: string;
  user_id?: string;
}

export interface LongUrl {
  id?: number;
  original_url?: string;
}

export interface Url {
  id?: string;
  user_id?: string;
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

export async function deleteUrl(id: number): Promise<null> {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to delete URL");
  }

  return data;
}
export async function createUrl(
  { title, longUrl, customUrl, user_id }: CreateUrl,
  qrcode: Blob | null
): Promise<UrlRow[]> {
  const short_url = Math.random().toString(36).substring(2, 8);
  const fileName = `qr-${short_url}`;
  console.log("Blob: ", qrcode);
  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode as Blob);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const qr = `${supabaseUrl}/storage/v1/object/qrs/${fileName}`;

  const { data, error } = await supabase
    .from("urls")
    .insert({
      title,
      original_url: longUrl,
      custom_url: customUrl ? customUrl : null,
      user_id,
      short_url,
      qr,
    })
    .select();

  if (error) {
    console.error(error.message);
    throw new Error("Error creating short URL");
  }

  return (data ?? []) as UrlRow[];
}

export async function getLongUrl(id: string): Promise<LongUrl> {
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Error fetching short link");
  }

  return data as LongUrl;
}

export async function getUrl({ id, user_id }: Url): Promise<UrlRow> {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Short URL not found!");
  }

  return data as UrlRow;
}
