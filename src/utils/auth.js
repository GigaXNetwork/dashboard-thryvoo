import Cookies from "js-cookie";

export const setAuthToken = (token) => {
  Cookies.remove("authToken", { path: "/" });
  Cookies.set("authToken", token, {
    expires: 90
  });
};
