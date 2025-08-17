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
import { login, type User } from "@/db/apiAuth";
import * as Yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

export type ErrorMap = Record<string, string>;
const Login = () => {
  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ErrorMap>({});
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { data, error, loading, fn: fnLogin } = useFetch(login, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    // console.log("Logged in user data:", data);
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  const handleLogin = async (): Promise<void> => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is required!"),
        password: Yup.string()
          .min(6, "Password must be atleast 6 characters!")
          .required("Password is required!"),
      });

      await schema.validate(formData, { abortEarly: false });
      //api call
      await fnLogin();
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
        <CardTitle>Login</CardTitle>
        <CardDescription>
          to your account if you already have one
        </CardDescription>
        {error && <ErrorMessage message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
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
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin} disabled={loading ?? false}>
          {loading ? (
            <BeatLoader size={10} color="black" />
          ) : (
            <span className="font-bold">Login</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
