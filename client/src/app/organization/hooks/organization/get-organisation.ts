
import { apiClient } from '@/providers/api-client';
import { useQuery} from '@tanstack/react-query';

// Fetch joined organizations
export const getPersonalOrganizations = async () => {

    const response = await apiClient.get('/organization');
    return response.data.data; // Extract data from the response
  
};

// Fetch available organizations
export const getAvailableOrganizations = async () => {
 
    const response = await apiClient.get('/organization/available');
    return response.data.data; // Extract data from the response
  
};

export function useGetPersonalOrganizations() {
    return useQuery({
      queryKey: ['getPersonalOrganizations'],
      queryFn: getPersonalOrganizations,
    });
  }

  export function useGetAvailableOrganizations() {
    return useQuery({
      queryKey: ['getAvailableOrganizations'],
      queryFn: getAvailableOrganizations,
    });
  }


