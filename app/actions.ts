"use server";

import { outputSchema } from "@/lib/types";
import { z } from "zod";

export type WebsiteActionsData = z.infer<typeof outputSchema>;

export type WebsiteActionsState = {
  url: string;
  data: WebsiteActionsData | null;
  error?: string;
};

export async function fetchWebsiteActions(
  prevState: WebsiteActionsState,
  formData: FormData
): Promise<WebsiteActionsState> {
  // I've installed React Form to deal with this but this is a good enough impl
  const urlInput = (formData.get("url") as string | null)?.trim() ?? "";

  // In theory this should never happen as we require the URL field on the FE
  // But since TS does not care / know about that....
  if (!urlInput) {
    return {
      ...prevState,
      url: "",
      error: "URL is required",
    };
  }

  const baseURL =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || "http://localhost:3000";

  try {
    const endpoint = `https://${baseURL}/api/website-actions?url=${encodeURIComponent(
      urlInput
    )}`;

    // Technically we should use POST, but hey, I've designed the API to be GET friendly and quickly test it
    const response = await fetch(endpoint, {
      headers: { "content-type": "application/json" },
    });

    if (!response.ok) {
      let message = response.statusText || "Request failed";

      try {
        const json = await response.json();
        if (json?.error) message = String(json.error);
      } catch {
        // ignore parse error
      }

      return {
        url: urlInput,
        data: null,
        error: `Failed to fetch: ${message}`,
      };
    }

    const json = (await response.json()) as { data: unknown };
    const parsed = outputSchema.safeParse(json.data);

    if (!parsed.success) {
      return {
        url: urlInput,
        data: null,
        error: "Unexpected response format",
      };
    }

    return {
      url: urlInput,
      data: parsed.data,
      error: undefined,
    };
  } catch (error) {
    return {
      url: urlInput,
      data: null,
      error: (error as Error).message || "Unknown error",
    };
  }
}
