import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../utils/prisma-client.js";
import z from 'zod';
export const createOrganization = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const nameSchema = z.string().min(2);
    const valiidatefield = nameSchema.safeParse(name);
    const user = req.session;
    if (!valiidatefield.success) {
        throw new ApiError(400, "Invalid or missing required field");
    }
    const organization = await prisma.organisation.create({
        data: {
            name: valiidatefield.data,
            created_by_id: user.id,
        }
    });
    if (!organization) {
        throw new ApiError(500, "Something went wrong while creating organization");
    }
    return new ApiResponse(200, organization);
});
export const getOrganizations = asyncHandler(async (req, res) => {
    const user = req.session;
    const organizations = await prisma.organisation.findMany({
        where: {
            created_by_id: user.id,
        }
    });
    return new ApiResponse(200, organizations);
});
