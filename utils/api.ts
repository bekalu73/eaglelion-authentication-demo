import axios, { AxiosError } from "axios";

interface ApiRequestOptions<T = unknown> {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: T;
  headers?: Record<string, string>;
}

export const apiRequest = async <T = unknown, D = unknown>({
  url,
  method,
  data,
  headers,
}: ApiRequestOptions<D>): Promise<T> => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message ||
          "An error occurred during the API request."
      );
    }
    throw new Error("An unexpected error occurred.");
  }
};
