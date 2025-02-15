"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Zod Schema for username validation
const ForgotPasswordSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [otpError, setOtpError] = useState<string | null>(null);

  // First API Request Mutation
  const otpRequestMutation = useMutation({
    mutationFn: async (values: { username: string }) => {
      try {
        const response = await axios.post(
          "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/ldapotp/dash/request/dashops",
          {
            username: values.username,
          },
          {
            headers: {
              sourceapp: "ldapportal",
              otpfor: "login",
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Full Response:", response);
        console.log("Response Data:", response.data);

        localStorage.setItem("accessToken", response.data.accesstoken);

        return response.data;
      } catch (error) {
        console.error("First API Request Error:", error);

        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
              "OTP request failed. Please try again."
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Navigate to OTP Verification Page
      router.push("/validate-forgot-password");
    },
    onError: (error: Error) => {
      setOtpError(error.message);
    },
  });

  const formik = useFormik({
    initialValues: { username: "" },
    validationSchema: toFormikValidationSchema(ForgotPasswordSchema),
    onSubmit: (values) => {
      // Reset previous errors
      setOtpError(null);
      // Trigger First API Request Mutation
      otpRequestMutation.mutate(values);
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

        <h2 className="text-xl font-semibold">Forgot PIN</h2>
        <p className="text-gray-500 mb-6">Enter your username to reset PIN</p>

        <form onSubmit={formik.handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...formik.getFieldProps("username")}
              className={`w-full p-2 border rounded ${
                formik.touched.username && formik.errors.username
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your username"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.username}
              </p>
            )}
          </div>

          {otpError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              <p>{otpError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={otpRequestMutation.isPending}
            className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {otpRequestMutation.isPending ? "Requesting OTP..." : "Request OTP"}
          </button>

          <div className="mt-4 text-right">
            <Link
              href="/login"
              className="text-blue-900 text-sm hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
