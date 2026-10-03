const apiUnavailableMessage =
  "The roastery API is unavailable. Check your connection and try again.";

function apiErrorMessage(error, fallback) {
  if (error instanceof TypeError) {
    return apiUnavailableMessage;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

async function readApiError(response, fallback) {
  try {
    const data = await response.json();
    if (data && typeof data.error === "string" && data.error) {
      return data.error;
    }
  } catch {
    // A non-JSON body still needs the fallback message.
  }
  return fallback;
}

export { apiErrorMessage, readApiError };
