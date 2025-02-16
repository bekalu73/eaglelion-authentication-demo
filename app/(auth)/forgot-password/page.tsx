"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FormInput from "../../../components/FormInput";
import { forgotPasswordValidationSchema } from "../../../utils/validation";
import { useAuth } from "../../../hooks/useAuth";

export default function ForgotPassword() {
  const router = useRouter();
  const [otpError, setOtpError] = useState<string | null>(null);
  const { otpRequestMutation } = useAuth();

  const formik = useFormik({
    initialValues: { username: "" },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: (values) => {
      setOtpError(null);
      otpRequestMutation.mutate(values, {
        onSuccess: (data) => {
          console.log("here isyour OTP", data.otpcode);
          localStorage.setItem("accessToken", data.accesstoken);
          router.push("/validate-forgot-password");
        },
        onError: (error) => {
          setOtpError(error.message || "OTP request failed. Please try again.");
        },
      });
    },
  });

  return (
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
        <FormInput
          label="Username"
          id="username"
          type="text"
          placeholder="Enter your username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.errors.username}
          touched={formik.touched.username}
        />

        {otpError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            <p>{otpError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={otpRequestMutation.isPending}
          className="w-full  bg-[#1B216C]  text-white p-2 rounded  disabled:opacity-50 outline-none"
        >
          {otpRequestMutation.isPending ? "Requesting OTP..." : "Request OTP"}
        </button>

        <div className="mt-4 text-right">
          <Link href="/login" className="text-blue-900 text-sm hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
