import { getCookie } from "cookies-next";
export const csrfToken = (getCookie("csrf_token") as string) || "";