import { apiClient } from "@/providers/api-client";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { createOrgSchema } from "@/types/types";
import { z } from "zod";




async function createOrganization(data:z.infer<typeof createOrgSchema>) {
    const response = await apiClient.post("/organization", data);
    console.log(response.data);
    return response.data;
    
}

export  function useCreateOrganization(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: async() => {
      await queryClient.invalidateQueries({ queryKey: ['getPersonalOrganizations'] });
    },
  });
}


