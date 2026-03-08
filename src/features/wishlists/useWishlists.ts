import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

export const useWishlists = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["wishlists", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await api.get(`/api/wishlists/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });
};
