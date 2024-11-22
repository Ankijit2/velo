
import { apiClient } from "@/providers/api-client";
import { useQueryClient,useMutation } from "@tanstack/react-query";
async function deleteOrg({org_id}:{org_id:string}) {
    const response = await apiClient.delete(`organization/${org_id}`);
    console.log(response.data);
    return response.data;
    
}

export  function useDeleteOrg(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrg,
    onSuccess: (_, variables) => {
        // Invalidate the query for the specific organization ID
        const orgId = variables.org_id; // Assuming orgId is part of mutation variables
        queryClient.invalidateQueries({ queryKey: ['getOrgEmployess', orgId] });
    },
})}