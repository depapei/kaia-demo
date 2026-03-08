import { useMutation } from "@tanstack/react-query";
import api from "../../api/axios";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await api.post("/auth/register", userData);
      return response.data;
    },
  });
};
