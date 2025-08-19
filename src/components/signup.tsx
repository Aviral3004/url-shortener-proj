import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import ErrorMessage from "./error";
import { useEffect, useState } from "react";
import { signup, type UserSignup } from "@/db/apiAuth";
import * as Yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

type ErrorMap = Record<string, string>;
const Signup = () => {
  const [formData, setFormData] = useState<UserSignup>({
    email: "",
    password: "",
    name: "",
    profile_pic: null,
  });
  const [errors, setErrors] = useState<ErrorMap>({});
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const { data, error, loading, fn: fnSignup } = useFetch(signup, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [error, loading]);

  const handleSignup = async (): Promise<void> => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required!"),
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is required!"),
        password: Yup.string()
          .min(6, "Password must be atleast 6 characters!")
          .required("Password is required!"),
        profile_pic: Yup.mixed().required("Profile picture is required!"),
      });

      await schema.validate(formData, { abortEarly: false });
      //api call
      await fnSignup();
    } catch (e) {
      const newErrors: ErrorMap = {};

      if (e instanceof Yup.ValidationError) {
        e.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
      }

      setErrors(newErrors);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create an account if you haven't already
        </CardDescription>
        {error && <ErrorMessage message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            type="text"
            placeholder="Enter Name"
            name="name"
            onChange={handleInputChange}
          />
          {errors.name && <ErrorMessage message={errors.name} />}
        </div>
        <div className="space-y-1">
          <Input
            type="email"
            placeholder="Enter Email"
            name="email"
            onChange={handleInputChange}
          />
          {errors.email && <ErrorMessage message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={handleInputChange}
          />
          {errors.password && <ErrorMessage message={errors.password} />}
        </div>
        <div className="space-y-1">
          <Input
            type="file"
            accept="image/*"
            name="profile_pic"
            onChange={handleInputChange}
            className="pr-4"
          />
          {errors.profile_pic && <ErrorMessage message={errors.profile_pic} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup} disabled={loading ?? false}>
          {loading ? (
            <BeatLoader size={10} color="black" />
          ) : (
            <span className="font-bold">Create Account</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
