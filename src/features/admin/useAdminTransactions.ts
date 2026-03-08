import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

export const useAdminTransactions = () => {
  return useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const response = await api.get("/admin/transactions/");
      return response.data.data;
    },
  });
};

export const useUpdateAdminTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transactionData: any) => {
      const response = await api.post("/admin/transactions", transactionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
    },
  });
};
