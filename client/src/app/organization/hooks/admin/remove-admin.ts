import { apiClient } from "@/providers/api-client";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { z } from "zod";


const validateSchema = z.object({
    organization_id: z.string(),
    employee_id: z.string(), // Renamed field for clarity
  });

async function removeAdmin(data:z.infer<typeof validateSchema>) {
    const response = await apiClient.post("/admin/remove", data);
    console.log(response.data);
    return response.data;
    
}

export  function useRemoveAdmin(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAdmin,
    onSuccess: (_, variables) => {
        // Invalidate the query for the specific organization ID
        const orgId = variables.organization_id; // Assuming orgId is part of mutation variables
        queryClient.invalidateQueries({ queryKey: ['getOrgEmployess', orgId] });
    },
  });
}


