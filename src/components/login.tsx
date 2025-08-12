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
import { useState } from "react";
import { login, type User } from "@/db/apiAuth";
import * as Yup from "yup";

type ErrorMap = Record<string, string>;
const Login = () => {
  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ErrorMap>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fnLogin = async (formData: User) => {
    try {
      console.log(formData);
      const response = await login(formData);
      console.log("Login succesfull!", response.user);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Login Failed!", err.message);
      }
      console.error("Unexpected error occurred during login!", err);
    }
  };

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
      await fnLogin(formData);
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
        <ErrorMessage message={"some error"} />
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
        <Button onClick={handleLogin}>
          {true ? (
            <BeatLoader size={10} color="#36d7b7" />
          ) : (
            <span className="font-bold">Login</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
