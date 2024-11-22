import { apiClient } from "@/providers/api-client";
import { useMutation,useQueryClient } from "@tanstack/react-query";

import { z } from "zod";


const validateSchema = z.object({
    added_user_id: z.array(z.string().min(1, "User ID is required.")).min(1, "At least one user is required."),
    org_id: z.string().min(1, "Organization ID is required."),
  });


async function addOrgEmployee(data:z.infer<typeof validateSchema>) {
    const response = await apiClient.post("/employee", data);
    console.log(response.data);
    return response.data;
    
}

export  function useAddOrgEmployee(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOrgEmployee,
    onSuccess: (_, variables) => {
        // Invalidate the query for the specific organization ID
        const orgId = variables.org_id; // Assuming orgId is part of mutation variables
        queryClient.invalidateQueries({ queryKey: ['getOrgEmployess', orgId] });
    },
  });
}


