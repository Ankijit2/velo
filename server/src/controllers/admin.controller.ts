import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../utils/prisma-client.js";
import { Request, Response } from "express";
import z from "zod";

const validateSchema = z.object({
  organization_id: z.string(),
  employee_id: z.string(), // Renamed field for clarity
});

const assignAdmin = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const user = req.session;

  // Validate request body
  const validatedField = validateSchema.safeParse(req.body);
  if (!validatedField.success) {
    throw new ApiError(400, "Invalid or missing required fields");
  }



  // Check if the user is a SuperAdmin of the organization
  const isSuperAdmin = await prisma.organisation.findUnique({
    where: {
      id: validatedField.data.organization_id,
      created_by_id: user.id,
    },
  });

  if (!isSuperAdmin) {
    throw new ApiError(403, "You don't have permission to assign admins");
  }

  // Update employees to ADMIN in bulk
  const makeAdmin = await prisma.employee.update({
    where: {
      id: validatedField.data.employee_id,
      organisation_id: validatedField.data.organization_id ,
    },
    data: { status: "ADMIN",permissions:"WRITE" },
  })

  return res.status(200).json(new ApiResponse(200, makeAdmin, "Admin assigned successfully"));
});

const removeAdmin = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const user = req.session;

  // Validate request body
  const validatedField = validateSchema.safeParse(req.body);
  if (!validatedField.success) {
    throw new ApiError(400, "Invalid or missing required fields");
  }

  // Check if the user is a SuperAdmin of the organization
  const isSuperAdmin = await prisma.organisation.findUnique({
    where: {
      id: validatedField.data?.organization_id,
      created_by_id: user.id,
    },
  });
  
  if (!isSuperAdmin) {
    throw new ApiError(403, "You don't have permission to remove admins");
  }

  if(user.id === validatedField.data?.employee_id){
    throw new ApiError(400, "You cannot remove yourself as an admin");
  }

  // Revoke admin status in bulk
  const revokeAdmin = await prisma.employee.update({
    where: {
      id: validatedField.data?.employee_id,
      organisation_id: validatedField.data?.organization_id,
    },
    data: { status: "USER",permissions:"READ" },
  })

  return res.status(200).json(new ApiResponse(200, revokeAdmin, "Admin removed successfully"));
});

export { assignAdmin, removeAdmin };
