import { apiClient } from "@/providers/api-client";
import { useMutation,useQueryClient } from "@tanstack/react-query";




 async function DeleteTask({org_id,task_id}:{org_id:string,task_id:string}) {
  console.log(task_id,org_id);
    return (await apiClient.delete(`/task/${org_id}/${task_id}`)).data.data
 }

 export  function useDeleteTask(){
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteTask,
    onSuccess: () => {

        queryClient.invalidateQueries({ queryKey: ['getTasks'] });
    },
  });
}


