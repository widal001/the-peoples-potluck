/**
 * Standardized API response format
 */

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface JsonResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

/**
 * Create a standardized JSON response
 */
export function jsonResponse<T = undefined>(
  body: ApiResponse<T>,
  options: JsonResponseOptions = {},
): Response {
  const { status = body.success ? 200 : 400, headers = {} } = options;

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

/**
 * Create a success response
 */
export function successResponse<T = undefined>(
  message: string,
  data?: T,
): Response {
  return jsonResponse({ success: true, message, data });
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  error?: string,
): Response {
  return jsonResponse({ success: false, message, error }, { status });
}
