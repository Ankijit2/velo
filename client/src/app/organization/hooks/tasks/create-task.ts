import { apiClient } from "@/providers/api-client";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import z from "zod"
import { taskSchema } from "@/types/types";



 async function CreateTask({data,org_id}:{data:z.infer<typeof taskSchema>,org_id:string}) {
    return (await apiClient.post(`/task/${org_id}`,data)).data.data
 }

 export  function useAddTask(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CreateTask,
    onSuccess: () => {
        
        queryClient.invalidateQueries({ queryKey: ['getTasks'] });
    },
  });
}


