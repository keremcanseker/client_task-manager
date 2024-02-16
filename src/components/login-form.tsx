import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserSchema } from "@/lib/types";
import { useLoginStore } from "@/lib/LoginStore";
import { api } from "@/lib/statics";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { setLoggedIn, isLoggedIn } = useLoginStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>({ resolver: zodResolver(UserSchema) });

  const handleLogin = async (data: User) => {
    const response = await fetch(`${api}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (response.status === 200) {
      const responseData = await response.json();
      const { username } = responseData; // Extract username from response
      localStorage.setItem("username", username); // Store username in local storage
      setLoggedIn(true);
    } else {
      console.error("Login failed:", response.statusText);
    }
  };

  return isLogin ? (
    <Card className="sm:w-[350px] w-auto py-4">
      <CardHeader className="text-center">
        <CardTitle>Task Manager</CardTitle>
        <CardDescription>Please login for managing your tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                placeholder="Username"
                {...register("username", { required: true })}
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsLogin(false)}>
                Register
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                Login
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  ) : (
    <RegisterForm isLogin={isLogin} setIsLogin={setIsLogin} />
  );
}

const RegisterForm = ({
  isLogin,
  setIsLogin,
}: {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>({ resolver: zodResolver(UserSchema) });

  const handleRegister = async (data: User) => {
    const response = await fetch(`${api}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (response.status === 200) {
      setIsLogin(true);
    } else {
      console.error("Register failed:", response.statusText);
    }
  };

  return (
    <Card className="sm:w-[350px] w-auto py-4">
      <CardHeader className="text-center">
        <CardTitle>Task Manager</CardTitle>
        <CardDescription>
          Enter a username and password for register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleRegister)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                placeholder="Username"
                {...register("username", { required: true })}
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsLogin(!isLogin)}>
                Back to Login
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                Register
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
