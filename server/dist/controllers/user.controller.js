import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../utils/prisma-client.js";
const getUser = asyncHandler(async (req, res) => {
    const org_id = req.params.org_id;
    if (!org_id) {
        throw new ApiError(400, "Organization ID is required");
    }
    const users = await prisma.user.findMany({
        where: {
            AND: [
                {
                    Employed_in: {
                        none: {
                            organisation_id: org_id, // No employment in the specified organization
                        },
                    },
                },
                {
                    Organizations_created: {
                        none: {
                            id: org_id
                        } // Did not create any organization
                    },
                },
            ],
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
    return res.status(200).json(new ApiResponse(200, users, "User details fetched successfully"));
});
export { getUser };
