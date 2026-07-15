import { mapPublicErrorToHttpStatus } from "./http-status-mapper.js";

export function mapAOEResponseToHttp(response) {
  if (response?.status === "ERROR") return { status: mapPublicErrorToHttpStatus(response.error?.code), body: response };
  return { status: 200, body: response };
}
