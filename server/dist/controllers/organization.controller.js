import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../utils/prisma-client.js";
import z from 'zod';
import { createOrgSchema } from "../types/types.js";
const createOrganization = asyncHandler(async (req, res) => {
    const validateField = createOrgSchema.safeParse(req.body);
    const user = req.session;
    if (!validateField.success) {
        throw new ApiError(400, "Invalid or missing required field");
    }
    await prisma.$transaction(async (prisma) => {
        // Create organization
        const organization = await prisma.organisation.create({
            data: {
                name: validateField.data.name, // Use the validated name
                created_by_id: user.id,
                sector: validateField.data.sector // User creating the organization
            },
        });
        // Create employee (super admin for the new organization)
        const employee = await prisma.employee.create({
            data: {
                user_id: user.id, // User ID from session
                organisation_id: organization.id, // Link to newly created organization
                status: "SUPERADMIN", // Set status to SUPERADMIN
            },
        });
        // If either creation fails, the transaction will be rolled back automatically
        if (!organization || !employee) {
            throw new ApiError(500, "Something went wrong while creating the organization or employee");
        }
        console.log("Organization created successfully");
        return res.status(201).json(new ApiResponse(201, organization, "Organization created successfully"));
    });
});
const getAvailableOrganizations = asyncHandler(async (req, res) => {
    const userId = req.session.id;
    const organizations = await prisma.organisation.findMany({
        where: {
            employees: {
                none: { user_id: userId } // Fetch organizations where no employee has the given user ID
            }
        },
        include: {
            created_by: true
        }
    });
    return res.status(200).json(new ApiResponse(200, organizations, "Available organizations fetched successfully"));
});
const getPersonalOrganizations = asyncHandler(async (req, res) => {
    const user = req.session;
    console.log(user);
    const joinedOrganizations = await prisma.organisation.findMany({
        where: {
            employees: {
                some: {
                    user_id: user.id, // The user must be an employee
                },
            },
            created_by_id: {
                not: user.id, // The user should not be the founder
            },
        },
        include: {
            created_by: {
                select: {
                    name: true,
                    email: true,
                }
            } // Include creator details
        },
    });
    const createdOrganizations = await prisma.organisation.findMany({
        where: {
            created_by_id: user.id
        },
        include: {
            created_by: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });
    return res.status(200).json(new ApiResponse(200, { joinedOrganizations, createdOrganizations }, "User's organizations fetched successfully"));
});
const getOrganizationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organization = await prisma.organisation.findUnique({
        where: {
            id: id,
        },
        include: {
            employees: true
        }
    });
    if (!organization) {
        throw new ApiError(404, "Organization not found or not authorized for acess");
    }
    return res.status(200).json(new ApiResponse(200, organization, "Organization details fetched successfully"));
});
const updateOrganization = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const nameSchema = z.string().min(2);
    const validateField = nameSchema.safeParse(name);
    if (!validateField.success) {
        throw new ApiError(400, "Invalid or missing required field");
    }
    const user = req.session;
    const organization = await prisma.organisation.update({
        where: {
            id: id,
            created_by_id: user.id, // User must be the creator of the organization to update it
        },
        data: {
            name: validateField.data, // Use the validated name
        },
    });
    if (!organization) {
        throw new ApiError(404, "Organization not found or not authorized for editing");
    }
    return res.status(200).json(new ApiResponse(200, organization, "Organization deleted successfully"));
});
const deleteOrganization = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.session;
    const organization = await prisma.organisation.delete({
        where: {
            id: id,
            created_by_id: user.id, // User must be the creator of the organization to delete it
        },
    });
    if (!organization) {
        throw new ApiError(404, "Organization not found or not authorized for deletion");
    }
    return res.status(200).json(new ApiResponse(200, organization, "Organization deleted successfully"));
});
const joinOrganization = asyncHandler(async (req, res) => {
    const user = req.session;
    const { org_id } = req.body;
    const validateSchema = z.object({
        org_id: z.string(),
    });
    const validateField = validateSchema.safeParse({ org_id });
    if (!validateField.success) {
        throw new ApiError(400, "Invalid or missing required field");
    }
    const findOrg = await prisma.organisation.findUnique({
        where: { id: org_id },
    });
    if (!findOrg) {
        throw new ApiError(404, "Organization not found");
    }
    const employee = await prisma.employee.create({
        data: {
            user_id: user.id, // The user joining
            organisation_id: org_id,
            status: "USER",
            permissions: "READ",
        },
    });
    return res.status(201).json(new ApiResponse(201, employee, "Employee joined successfully"));
});
export { createOrganization, getOrganizationById, getAvailableOrganizations, updateOrganization, deleteOrganization, getPersonalOrganizations, joinOrganization };
