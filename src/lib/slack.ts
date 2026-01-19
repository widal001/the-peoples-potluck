/**
 * Slack integration for posting messages via incoming webhooks
 */

export interface SlackResult {
  success: boolean;
  status: number;
  message: string;
  error?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  sourceUrl?: string;
}

/**
 * Format a contact form submission as a Slack Block Kit message
 */
function formatContactMessage(data: ContactFormData) {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📬 New Contact Form Submission",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Name:* ${data.name}`,
          },
          {
            type: "mrkdwn",
            text: `*Email:* ${data.email}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Message:*\n${data.message}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Submitted at ${new Date().toISOString()}${data.sourceUrl ? ` • ${data.sourceUrl}` : ""}`,
          },
        ],
      },
    ],
  };
}

/**
 * Post a contact form submission to Slack
 */
export async function postContactToSlack(
  webhookUrl: string,
  data: ContactFormData,
): Promise<SlackResult> {
  try {
    const message = formatContactMessage(data);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Slack API error:", errorText);
      return {
        success: false,
        status: response.status,
        message: "Failed to send message to Slack",
        error: errorText,
      };
    }

    return {
      success: true,
      status: 200,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("Slack request failed:", error);
    return {
      success: false,
      status: 500,
      message: "Failed to connect to Slack",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
