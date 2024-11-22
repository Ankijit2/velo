import { apiClient } from "@/providers/api-client";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { z } from "zod";


const validateSchema = z.object({
    organization_id: z.string(),
    employee_id: z.string(), // Renamed field for clarity
  });

async function addAdmin(data:z.infer<typeof validateSchema>) {
    const response = await apiClient.post("/admin/assign", data);
    console.log(response.data);
    return response.data;
    
}

export  function useAddAdmin(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAdmin,
    onSuccess: (_, variables) => {
        // Invalidate the query for the specific organization ID
        const orgId = variables.organization_id; // Assuming orgId is part of mutation variables
        queryClient.invalidateQueries({ queryKey: ['getOrgEmployess', orgId] });
    },
  });
}


