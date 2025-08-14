import supabase from "./supabase";

interface UrlClicks {
  city: string;
  country: string;
  created_at?: string;
  device: string;
  id: number;
  url_id: number;
}

export async function getClicksForUrls(urlIds: number[]): Promise<UrlClicks[]> {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load Clicks");
  }

  return (data ?? []) as UrlClicks[];
}
