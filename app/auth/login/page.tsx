"use client";

import { z } from "zod";
import { Form } from "@/components/form/From";
import { Input, Label } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { showAlert } from "@/components/ui/alert/Alert";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid admin email"),
  password: z.string().min(4, "Security requires at least 8 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();

/* page.tsx ke handleLogin function mein ye change karein */

const handleLogin = async (data: LoginSchema) => {
  try {
    // Port 3000 ka use karein aur credentials add karein
    const res = await fetch("http://localhost:3000/api/auth/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ye Cookies/Sessions ke liye zaroori hai
      body: JSON.stringify(data),
    });

    
  


    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Login failed");
    }

    showAlert({
      type: "success",
      title: "Login Successful",
      text: "Welcome to dashboard",
    });

    router.push("/dashboard");

  } catch (error: any) {
    showAlert({
      type: "error",
      title: "Login Failed",
      text: error.message || "Something went wrong",
    });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <Form<LoginSchema>
          schema={loginSchema}
          onSubmit={handleLogin}
          className="space-y-5"
        >
          {({ register, formState: { errors, isSubmitting } }) => (
            <>
              <div className="space-y-1">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@dobelgo.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Access Dashboard
              </Button>
            </>
          )}
        </Form>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
