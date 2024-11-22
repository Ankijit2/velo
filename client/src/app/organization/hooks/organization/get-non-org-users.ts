import { apiClient } from '@/providers/api-client';
import { useQuery} from '@tanstack/react-query';

async function getNonOrgEmployess(id: string){
    return ((await apiClient.get(`/user/non-org/${id}`)).data.data);
}

export function useGetNonOrgEmployess(id: string){
    return useQuery({
        queryKey: ['getNonOrgEmployess',id],
        queryFn: () => getNonOrgEmployess(id)
    })
}