import Cookies from "js-cookie";

export const setAuthToken = (token) => {
  Cookies.remove("authToken", { path: "/" });

  const formattedToken = `Bearer ${token}`
  Cookies.set("authToken", formattedToken, {
    expires: 90
  });
};
