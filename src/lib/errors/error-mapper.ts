/**
 * Maps HTTP status codes to meaningful errors/exceptions.
 * Customize this to return specific error types as needed by your application.
 */
export function mapStatusCodeToException(
  statusCode: number,
  statusText?: string,
): Error {
  let message = statusText || `HTTP Error ${statusCode}`;

  switch (statusCode) {
    case 400:
      message = "Bad Request - The server could not understand the request.";
      break;
    case 401:
      message = "Unauthorized - Please log in again.";
      break;
    case 403:
      message =
        "Forbidden - You do not have permission to perform this action.";
      break;
    case 404:
      message = "Not Found - The requested resource could not be found.";
      break;
    case 422:
      message = "Unprocessable Entity - Validation failed.";
      break;
    case 500:
      message = "Internal Server Error - Something went wrong on the server.";
      break;
  }

  return new Error(message);
}
