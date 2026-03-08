import { useMutation } from "@tanstack/react-query";
import api from "../../api/axios";

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await api.post("/admin/auth/login", credentials);
      return response.data;
    },
  });
};
