import { apiClient } from '@/providers/api-client';
import { useQuery} from '@tanstack/react-query';

async function getOrgEmployess(id: string){
    return ((await apiClient.get(`/employee/getAll/${id}`)).data.data);
}

export function useGetOrgEmployess(id: string){
    return useQuery({
        queryKey: ['getOrgEmployess',id],
        queryFn: () => getOrgEmployess(id)
    })
}