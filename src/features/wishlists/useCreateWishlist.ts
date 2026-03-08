import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

export const useCreateWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wishlistData: { userId: string; productId: string }) => {
      const response = await api.post("/api/wishlists/", wishlistData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["wishlists", variables.userId],
      });
    },
  });
};
