import { apiClient } from '@/providers/api-client';
import { useQuery} from '@tanstack/react-query';

async function getTasks(org_id: string){
    return ((await apiClient.get(`/task/${org_id}`)).data.data);
}

export function useGetTasks(org_id: string){
    return useQuery({
        queryKey: ['getTasks',org_id],
        queryFn: () => getTasks(org_id)
    })
}