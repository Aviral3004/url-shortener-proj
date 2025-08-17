import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UrlState } from "@/context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import ErrorMessage from "./error";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import QRCode from "react-qrcode-logo";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import type { ErrorMap } from "./login";
export interface CreateLink {
  title: string;
  longUrl: string;
  customUrl: string;
}
const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const qrWrapperRef = useRef<HTMLDivElement | null>(null);

  const [errors, setErrors] = useState<ErrorMap>({});
  const [formValues, setFormValues] = useState<CreateLink>({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required!"),
    longUrl: yup
      .string()
      .url("Must be a valid URL!")
      .required("Long URL is required!"),
    customUrl: yup.string(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user?.id });

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = qrWrapperRef.current?.querySelector("canvas");
      if (!canvas) {
        throw new Error("QR Code not rendered yet!");
      }
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve);
      });
      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors: ErrorMap = {};

      if (e instanceof yup.ValidationError) {
        e.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
      }

      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);

  return (
    <Dialog
      defaultOpen={!!longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger className="p-2 bg-white text-black text-sm rounded-lg font-bold hover:bg-gray-300 cursor-pointer hover:scale-95 duration-200">
        Create New Link
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
          <Input
            id="title"
            placeholder="Short Link's Title"
            value={formValues.title}
            onChange={handleChange}
          />
          {errors.title && <ErrorMessage message={errors.title} />}
          <Input
            id="longUrl"
            placeholder="Enter your looong URL"
            value={formValues.longUrl}
            onChange={handleChange}
          />
          {errors.longUrl && <ErrorMessage message={errors.longUrl} />}
          <div className="flex items-center gap-2">
            <Card className="p-2">byteLink.in</Card>
            /
            <Input
              id="customUrl"
              placeholder="Enter Custom URL (optional)"
              value={formValues.customUrl}
              onChange={handleChange}
            />
          </div>
          {error && <ErrorMessage message={error.message} />}
        </DialogHeader>
        {formValues?.longUrl && (
          <div ref={qrWrapperRef}>
            <QRCode
              value={formValues?.longUrl}
              size={250}
              ecLevel="H"
              logoImage="/logo.png"
              logoWidth={50}
              logoHeight={50}
              removeQrCodeBehindLogo={true}
            />
          </div>
        )}
        <DialogFooter className="sm:justify-start">
          <Button
            disabled={loading ?? false}
            type="submit"
            className="p-2 bg-white text-black text-sm rounded-lg font-bold hover:bg-gray-300 cursor-pointer hover:scale-95 duration-200"
            onClick={createNewLink}
          >
            {loading ? <BeatLoader size={10} color="black" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;
