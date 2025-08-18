import { deleteUrl, type UrlRow } from "@/db/apiUrls";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Check, Copy, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { BeatLoader } from "react-spinners";
import { useEffect, useState } from "react";

export interface FilterUrls {
  url: UrlRow;
  fetchUrls: () => Promise<void>;
}

const LinkCard = ({ url, fetchUrls }: FilterUrls) => {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const downloadImage = () => {
    const imageUrl = url.qr;
    const fileName = url.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <>
      <title>My Links</title>
      <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
        <img
          src={url.qr}
          alt="qr code"
          className="h-32 object-contain ring ring-blue-500 self-start"
        />
        <Link to={`/link/${url.id}`} className="flex flex-col flex-1">
          <span className="text-3xl font-extrabold hover:underline cursor-pointer">
            {url.title}
          </span>
          <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer break-all">
            https://byteLink.in/
            {url.custom_url ? url.custom_url : url.short_url}
          </span>
          <span className="flex items-center gap-1 hover:underline cursor-pointer break-all">
            {url.original_url}
          </span>
          <span className="flex flex-1 items-end font-extralight text-sm">
            {new Date(url.created_at).toLocaleString("en-IN", { hour12: true })}
          </span>
        </Link>

        <div className="flex gap-2">
          <Button
            variant={"ghost"}
            onClick={() => {
              navigator.clipboard.writeText(
                `https://byteLink.in/${url.short_url}`
              );

              setCopied(true);
            }}
          >
            {copied ? <Check /> : <Copy />}
          </Button>
          <Button variant={"ghost"} onClick={downloadImage}>
            <Download />
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => fnDelete().then(() => fetchUrls())}
            disabled={loadingDelete ?? false}
          >
            {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
          </Button>
        </div>
      </div>
    </>
  );
};

export default LinkCard;
