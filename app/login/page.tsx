"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { loginValidationSchema } from "@/utils/validation";
import PasswordInput from "@/components/PasswordInput";

export default function Login() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const { loginMutation } = useAuth();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsTokenExpired(true);
      setLoginError(
        "Your session has expired. Please start the authentication process again."
      );
    }
  }, []);

  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      setLoginError(null);
      if (isTokenExpired) {
        router.push("/forgot-password");
        return;
      }
      loginMutation.mutate(values, {
        onSuccess: (data) => {
          localStorage.setItem("loginToken", data.token);
          Cookies.set("loginToken", data.token, { expires: 7 });
          localStorage.removeItem("accessToken");
          router.push("/dashboard");
        },
        onError: (error) => {
          setLoginError(
            error.message || "Login failed. Please check your credentials."
          );
        },
      });
    },
  });

  return (
    <div className="flex h-screen bg-gray-100 px-20 py-10 shadow">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col w-1/2 bg-blue-900 text-white items-center justify-center p-8 gap-4 rounded-bl-lg rounded-tl-lg ">
        <p className="text-lg ">Welcome to</p>
        <h2 className="text-3xl font-bold">Dashen Super App Dashboard</h2>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white p-8 rounded-br-lg rounded-tr-lg">
        <Image
          src="/logos/dashen-logo.png"
          alt="Dashen Bank"
          width={80}
          height={80}
          className="mb-4"
        />

        <h2 className="text-xl font-semibold">Login</h2>
        <p className="text-gray-500 mb-6">Welcome to Dashen Bank Dashboard</p>

        <form onSubmit={formik.handleSubmit} className="w-full max-w-sm">
          <PasswordInput
            label="Enter PIN"
            id="password"
            placeholder="Enter your PIN"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.errors.password}
            touched={formik.touched.password}
            disabled={isTokenExpired}
          />

          <button
            type="submit"
            disabled={loginMutation.isPending || isTokenExpired}
            className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isTokenExpired
              ? "Start Over"
              : loginMutation.isPending
              ? "Signing In..."
              : "Sign In"}
          </button>

          {isTokenExpired ||
            (loginError && (
              <div className="mt-4 text-center text-red-600">
                Your session has expired. Please restart the authentication
                process.
              </div>
            ))}

          <div className="mt-4 text-right">
            <Link
              href="/forgot-password"
              className="text-blue-900 text-sm hover:underline"
            >
              Forgot PIN?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
