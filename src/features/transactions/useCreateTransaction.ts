import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transactionData: any) => {
      const response = await api.post("/transactions/", transactionData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.user_id],
      });
    },
  });
};
