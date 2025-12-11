// import { csrfToken } from '@/lib/csrf-cookies';
export const axiosConfig = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        // 'X-Frappe-CSRF-Token': csrfToken,
    },
}

export const axiosConfigMultipart = {
    withCredentials: true,
    headers: {
        withCredentials: true,
        // 'X-Frappe-CSRF-Token': csrfToken,
    },
}







// import { getCookie } from "cookies-next";

// export const axiosConfig = () => ({
//     withCredentials: true,
//     headers: {
//         "Content-Type": "application/json",
//         "X-Frappe-CSRF-Token": getCookie("csrf_token") || ""
//     }
// });

// export const axiosConfigMultipart = () => ({
//     withCredentials: true,
//     headers: {
//         "X-Frappe-CSRF-Token": getCookie("csrf_token") || ""
//     }
// });
