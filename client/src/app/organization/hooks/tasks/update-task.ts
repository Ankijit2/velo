import { apiClient } from "@/providers/api-client";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import z from "zod"
import { taskSchema } from "@/types/types";



 async function updateTask({data,org_id,task_id}:{data:z.infer<typeof taskSchema>,org_id:string,task_id:string}) {
    return (await apiClient.put(`/task/${org_id}/${task_id}`,data)).data.data
 }

 export  function useUpdateTask(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (_, variables) => {
        // Invalidate the query for the specific organization ID
        const orgId = variables.org_id; // Assuming orgId is part of mutation variables
        queryClient.invalidateQueries({ queryKey: ['getTasks', orgId] });
    },
  });
}


