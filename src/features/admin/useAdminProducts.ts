import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await api.get("/admin/products/");
      return response.data.data;
    },
  });
};

export const useCreateAdminProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData: any) => {
      const response = await api.post("/admin/products/", productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
