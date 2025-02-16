import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../utils/api";

interface LoginResponse {
  token: string;
}

interface OtpRequestResponse {
  otpcode(arg0: string, otpcode: any): unknown;
  accesstoken: string;
}

interface OtpVerificationResponse {
  token: string;
}

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useAuth = () => {
  // Login Mutation
  const loginMutation = useMutation<LoginResponse, Error, { password: string }>(
    {
      mutationFn: (values) =>
        apiRequest<LoginResponse, { password: string }>({
          url: `${API_BASE_URL}/ldapauth/dash/pinops/passwordLogin`,
          method: "POST",
          data: { password: values.password },
          headers: {
            sourceapp: "ldapportal",
            otpfor: "login",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }),
    }
  );

  // OTP Request Mutation
  const otpRequestMutation = useMutation<
    OtpRequestResponse,
    Error,
    { username: string }
  >({
    mutationFn: (values) =>
      apiRequest<OtpRequestResponse, { username: string }>({
        url: `${API_BASE_URL}/ldapotp/dash/request/dashops`,
        method: "POST",
        data: { username: values.username },
        headers: {
          sourceapp: "ldapportal",
          otpfor: "login",
          "Content-Type": "application/json",
        },
      }),
  });

  // OTP Verification Mutation
  const otpVerificationMutation = useMutation<
    OtpVerificationResponse,
    Error,
    { otpcode: string }
  >({
    mutationFn: (values) =>
      apiRequest<OtpVerificationResponse, { otpcode: string }>({
        url: `${API_BASE_URL}/ldapotp/dash/confirm/dashops`,
        method: "POST",
        data: { otpcode: values.otpcode },
        headers: {
          sourceapp: "ldapportal",
          otpfor: "login",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
  });

  return {
    loginMutation,
    otpRequestMutation,
    otpVerificationMutation,
  };
};
