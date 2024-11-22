
import { apiClient } from "@/providers/api-client";
import { useQueryClient,useMutation } from "@tanstack/react-query";
async function deleteEmployee({org_id, employee_id}:{org_id:string, employee_id:string}) {
    const response = await apiClient.delete(`employee/${org_id}/${employee_id}`);
    console.log(response.data);
    return response.data;
    
}

export  function useDeleteEmployee(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (_, variables) => {
        // Invalidate the query for the specific organization ID
        const orgId = variables.org_id; // Assuming orgId is part of mutation variables
        queryClient.invalidateQueries({ queryKey: ['getOrgEmployess', orgId] });
    },
})}