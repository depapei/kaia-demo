import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

export const useTransactions = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await api.get(`/api/transactions/${userId}`);
      console.log(response.data.data);
      return response.data.data;
    },
    enabled: !!userId,
  });
};
