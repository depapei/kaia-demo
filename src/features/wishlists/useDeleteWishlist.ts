import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

export const useDeleteWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, product_id }: { user_id: string; product_id: string }) => {
      const response = await api.delete(`/api/wishlists/${user_id}/${product_id}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wishlists", variables.user_id] });
    },
  });
};
