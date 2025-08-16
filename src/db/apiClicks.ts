import supabase from "./supabase";
import { UAParser } from "ua-parser-js";

interface UrlClicks {
  city: string;
  country: string;
  created_at?: string;
  device: string;
  id: number;
  url_id: number;
}

export interface IpDetails {
  city: string;
  country_name: string;
}

export interface LongUrl {
  id?: number;
  original_url?: string;
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

const parser = new UAParser();

export const storeClicks = async ({ id, original_url }: LongUrl) => {
  try {
    const res = parser.getResult();
    const device = res.device.type || "desktop";

    const response = await fetch("https://ipapi.co/json");
    const { city, country_name: country }: IpDetails = await response.json();

    await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });

    window.location.href = original_url as string;
  } catch (err) {
    console.error("Error recording click", err);
  }
};

export async function getClicksForUrl(url_id?: number): Promise<UrlClicks[]> {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id)

  if (error) {
    console.error(error.message);
    throw new Error("Unable to Load Stats!");
  }

  return (data ?? []) as UrlClicks[];
}
