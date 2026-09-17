import Cookies from "js-cookie";
import { AUTH_SESSION_ENDPOINT } from "@/api/config";

// Reads the non-secret "logged_in" presence flag.
// The actual JWT lives in an HttpOnly server cookie and is never exposed to JS.
export const isUserLoggedIn = () => {
  return Cookies.get("logged_in");
};

export const createSession = async (jwt: string) => {
  return fetch(AUTH_SESSION_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jwt }),
  });
};

export const destroySession = async () => {
  return fetch(AUTH_SESSION_ENDPOINT, { method: "DELETE" });
};