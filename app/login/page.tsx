"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

// Comprehensive Zod Schema for PIN validation
const LoginSchema = z.object({
  password: z.string().min(4, "PIN must be at least 4 characters"),
});

// Define an interface for the error response
interface ErrorResponse {
  message?: string;
}

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  // Check token validity on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsTokenExpired(true);
      setLoginError(
        "Your session has expired. Please start the authentication process again."
      );
    }
  }, []);

  // Final Login Request Mutation
  const loginMutation = useMutation({
    mutationFn: async (values: { password: string }) => {
      try {
        // Retrieve access token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Missing authentication context");
        }

        const response = await axios.post(
          "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/ldapauth/dash/pinops/passwordLogin",
          {
            password: values.password,
          },
          {
            headers: {
              sourceapp: "ldapportal",
              otpfor: "login",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Login Response:", response.data);

        // Store final login token
        localStorage.setItem("loginToken", response.data.token);
        // Remove access token after successful login
        localStorage.removeItem("accessToken");

        return response.data;
      } catch (error) {
        console.error("Login Error:", error);

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          throw new Error(
            axiosError.response?.data?.message ||
              "Login failed. Please check your credentials."
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Navigate to Dashboard
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      setLoginError(error.message);
    },
  });

  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: toFormikValidationSchema(LoginSchema),
    onSubmit: (values) => {
      // Reset previous errors
      setLoginError(null);

      // If token is expired, redirect to forgot password
      if (isTokenExpired) {
        router.push("/forgot-password");
        return;
      }

      // Trigger Final Login Request Mutation
      loginMutation.mutate(values);
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
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Enter PIN
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...formik.getFieldProps("password")}
                className={`w-full p-2 border rounded ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter your PIN"
                disabled={isTokenExpired}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              <p>{loginError}</p>
            </div>
          )} */}

          <button
            type="submit"
            disabled={loginMutation.isPending || isTokenExpired}
            className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-700disabled:opacity-50"
          >
            {isTokenExpired
              ? "Start Over"
              : loginMutation.isPending
              ? "Signing In..."
              : "Sign In"}
          </button>

          {isTokenExpired && (
            <div className="mt-4 text-center text-red-600">
              Your session has expired. Please restart the authentication
              process.
            </div>
          )}

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
