import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const isAdmin = config.url?.startsWith("/admin");
    let token = "";

    if (isAdmin) {
      token = localStorage.getItem("adminToken") || "";
    } else {
      const kaiaUser = localStorage.getItem("kaiaUser");
      if (kaiaUser) {
        try {
          const parsed = JSON.parse(kaiaUser);
          // If it's an object, try to get token property, otherwise use the whole string (if it was just a token)
          token = typeof parsed === "object" ? parsed.token || "" : kaiaUser;
        } catch (e) {
          // If not JSON, it's probably the token itself
          token = kaiaUser;
        }
      }
    }

    if (token && !isAdmin) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && isAdmin) {
      const bearer = import.meta.env.VITE_ADMIN_BEARER_TOKEN;
      config.headers.Authorization = `${bearer} ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
