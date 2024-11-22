import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../utils/prisma-client.js";
import z from "zod";
// Schema validation
const updateStatus = asyncHandler(async (req, res) => {
    const { org_id, employee_id } = req.params;
    const user = req.session;
    const { status } = req.body;
    const validatedSchema = z.string().min(1);
    console.log(status);
    const validateField = validatedSchema.safeParse(status);
    if (!validateField.success) {
        throw new ApiError(400, "Invalid or missing required field");
    }
    const isAdmin = await prisma.employee.findFirst({
        where: {
            user_id: user.id,
            organisation_id: org_id,
            status: { in: ["ADMIN", "SUPERADMIN"] }, // Ensure the one deleting is an admin
        },
    });
    if (!isAdmin) {
        throw new ApiError(403, "You don't have permission to delete employees");
    }
    const updateUser = await prisma.employee.update({
        where: {
            id: employee_id
        },
        data: { permissions: status },
    });
    if (!updateUser) {
        throw new ApiError(404, "Employee not found");
    }
    return res.status(200).json(new ApiResponse(200, updateUser, "Employee status updated successfully"));
});
// Join Employee (employee self-joins the organization)
// Add Employee (admin adds an employee to the organization)
const addEmployee = asyncHandler(async (req, res) => {
    const { org_id, added_user_id } = req.body;
    const user = req.session;
    const validateSchema = z.object({
        added_user_id: z.array(z.string().min(1, "User ID is required.")).min(1, "At least one user is required."),
        org_id: z.string().min(1, "Organization ID is required."),
    });
    const validateField = validateSchema.safeParse({ added_user_id, org_id });
    if (!validateField.success) {
        console.log(validateField.error);
        throw new ApiError(400, "Invalid or missing required field");
    }
    const isAdmin = await prisma.employee.findFirst({
        where: {
            user_id: user.id,
            organisation_id: org_id,
            status: { in: ["ADMIN", "SUPERADMIN"] }, // Ensure the one adding is an admin
        },
    });
    if (!isAdmin) {
        throw new ApiError(403, "You don't have permission to add employees");
    }
    const employees = await Promise.all(added_user_id.map(async (userId) => {
        return prisma.employee.create({
            data: {
                user_id: userId,
                organisation_id: org_id,
                status: "USER",
                permissions: "READ" // Default status for new employees
            },
        });
    }));
    // Return a success response
    return res.status(201).json(new ApiResponse(201, employees, "Employees added successfully"));
});
// Delete Employee
const deleteEmployee = asyncHandler(async (req, res) => {
    const { employee_id, org_id } = req.params;
    const validatedSchema = z.object({
        employee_id: z.string(),
        org_id: z.string(),
    });
    console.log(req.params);
    const validateField = validatedSchema.safeParse({ employee_id, org_id });
    if (!validateField.success) {
        throw new ApiError(400, "Invalid or missing required field");
    }
    const user = req.session;
    const isAdmin = await prisma.employee.findFirst({
        where: {
            user_id: user.id,
            organisation_id: validateField.data.org_id,
            status: { in: ["ADMIN", "SUPERADMIN"] }, // Ensure the one deleting is an admin
        },
    });
    if (!isAdmin) {
        throw new ApiError(403, "You don't have permission to delete employees");
    }
    if (isAdmin.status === "ADMIN") {
        const checkUser = await prisma.employee.findFirst({
            where: {
                user_id: validateField.data.employee_id,
                organisation_id: validateField.data.org_id,
                status: { in: ["ADMIN", "SUPERADMIN"] }, // Ensure the one deleting is an admin
            },
        });
        if (checkUser) {
            throw new ApiError(400, "You cannot delete an admin");
        }
    }
    const employee = await prisma.employee.delete({
        where: { id: validateField.data.employee_id },
    });
    return res.status(200).json(new ApiResponse(200, employee, "Employee deleted successfully"));
});
// Get All Employees
const getAllEmployees = asyncHandler(async (req, res) => {
    const orgId = req.params.org_id;
    const user = req.session;
    const currentUser = await prisma.employee.findFirst({
        where: {
            user_id: user.id,
            organisation_id: orgId,
        },
        include: {
            user: {
                select: { name: true, email: true },
            },
        },
    });
    if (!currentUser) {
        throw new ApiError(403, "You don't have permission to access this organization");
    }
    const employees = await prisma.employee.findMany({
        where: {
            organisation_id: orgId,
            NOT: { user_id: user.id }, // Exclude current user
        },
        include: {
            user: {
                select: { name: true, email: true },
            },
        },
    });
    const admins = employees.filter((e) => e.status === "ADMIN");
    const superAdmin = employees.find((e) => e.status === "SUPERADMIN");
    const users = employees.filter((e) => e.status === "USER");
    return res.status(200).json(new ApiResponse(200, { admins, superAdmin, users, currentUser }, "Employees fetched successfully"));
});
export { addEmployee, deleteEmployee, getAllEmployees, updateStatus };
