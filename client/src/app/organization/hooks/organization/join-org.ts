import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/providers/api-client";

const joinOrg = async (org_id: string) => {
    const res = await apiClient.post("/organization/join", { org_id });
    return res.data.data;
};

export const useJoinOrg = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: joinOrg,
        onSuccess: async () => {
            // Invalidate queries to refresh organization data
            await queryClient.invalidateQueries({ queryKey: [ 'getAvailableOrganizations'] });
        },
        onError: (error) => {
            // Optional: Handle the error, e.g., show an error notification
            console.error("Error joining organization:", error);
        },
    });
};
