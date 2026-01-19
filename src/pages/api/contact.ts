import type { APIRoute } from "astro";
import { postContactToSlack, type ContactFormData } from "@/lib/slack";
import { successResponse, errorResponse } from "@/lib/api-response";

export const prerender = false;

interface CloudflareEnv {
  SLACK_WEBHOOK_URL: string;
  // Set to "true" to skip Slack posting (for testing UX)
  DRY_RUN?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Get the Cloudflare runtime environment
    const runtime = (locals as { runtime?: { env: CloudflareEnv } }).runtime;
    const env = runtime?.env;

    // Parse form data
    const formData = await request.formData();

    // Get the source URL from Referer header or Origin
    const sourceUrl =
      request.headers.get("Referer") ||
      request.headers.get("Origin") ||
      undefined;

    const data: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      sourceUrl,
    };

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return errorResponse("All fields are required", 400);
    }

    // Check if dry run mode is enabled (for testing UX without posting to Slack)
    const isDryRun = env?.DRY_RUN === "true";

    if (isDryRun) {
      console.log("[DRY RUN] Would have posted to Slack:", data);
      return successResponse("Message sent successfully", { dryRun: true });
    }

    // Get Slack webhook URL from Cloudflare runtime environment
    const slackWebhookUrl = env?.SLACK_WEBHOOK_URL;

    if (!slackWebhookUrl) {
      console.error("SLACK_WEBHOOK_URL environment variable is not set");
      return errorResponse("Server configuration error", 500);
    }

    // Post to Slack
    const result = await postContactToSlack(slackWebhookUrl, data);

    if (!result.success) {
      return errorResponse(result.message, result.status, result.error);
    }

    return successResponse(result.message);
  } catch (error) {
    console.error("Error processing contact form:", error);
    return errorResponse(
      "Internal server error",
      500,
      error instanceof Error ? error.message : undefined,
    );
  }
};
