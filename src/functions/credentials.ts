import Cookies from "js-cookie";

export const isUserLoggedIn = () => {
  return Cookies.get("credentials");
};
