import z from 'zod';
export const createOrgSchema = z.object({
    name: z.string().min(2, {
        message: "Organization name must be at least 2 characters.",
    }),
    sector: z.string().min(2, {
        message: "Sector must be at least 2 characters.",
    }),
});
