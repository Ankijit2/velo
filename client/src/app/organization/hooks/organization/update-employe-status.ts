
import { apiClient } from "@/providers/api-client";
import { useQueryClient,useMutation } from "@tanstack/react-query";
async function changeEmployeeStatus({org_id, employee_id,status}:{org_id:string, employee_id:string,status:string}) {
    const response = await apiClient.patch(`employee/${org_id}/${employee_id}`,{
        status
    });
    console.log(response.data);
    return response.data;
    
}

export  function useChangeEmployeeStatus(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeEmployeeStatus,
    onSuccess: (_, variables) => {
        // Invalidate the query for the specific organization ID
        const orgId = variables.org_id; // Assuming orgId is part of mutation variables
        queryClient.invalidateQueries({ queryKey: ['getOrgEmployess', orgId] });
    },
})}