import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../utils/prisma-client.js";
import z from "zod";
const getTask = asyncHandler(async (req, res) => {
    const { org_id } = req.params;
    const user = req.session;
    if (!org_id) {
        throw new ApiError(400, "Organization ID is required");
    }
    const isAceesable = await prisma.employee.findFirst({
        where: {
            user_id: user.id,
            organisation_id: org_id
        }
    });
    console.log(isAceesable);
    if (!isAceesable) {
        throw new ApiError(403, "You don't have permission to view tasks");
    }
    const task = await prisma.task.findMany({
        where: {
            organisationId: org_id
        },
    });
    return res.status(200).json(new ApiResponse(200, task, "Tasks fetched successfully"));
});
const createTask = asyncHandler(async (req, res) => {
    const user = req.session;
    const org_id = req.params.org_id;
    if (!org_id) {
        throw new ApiError(400, "Invalid organization ID");
    }
    const taskSchema = z.object({
        title: z.string().min(2),
        description: z.string().min(2),
        status: z.enum(["PENDING", "STARTED", "COMPLETED", "CANCELLED"]).optional(),
    });
    const isAceesable = await prisma.employee.findFirst({
        where: {
            user_id: user.id,
            organisation_id: org_id
        }
    });
    if (!isAceesable || isAceesable.status === "USER" && isAceesable.permissions != "WRITE") {
        throw new ApiError(403, "You don't have permission to create task");
    }
    const valiidatefield = taskSchema.safeParse(req.body);
    if (!valiidatefield.success) {
        throw new ApiError(400, "Invalid or missing required field");
    }
    const data = {
        title: valiidatefield.data.title,
        description: valiidatefield.data.description,
        organisationId: org_id,
        createdById: user.id,
    };
    // Use `data` in your Prisma query
    const task = await prisma.task.create({
        data,
    });
    if (!task) {
        throw new ApiError(500, "Something went wrong while creating task");
    }
    return res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});
const updateTask = asyncHandler(async (req, res) => {
    const { task_id, org_id } = req.params;
    const user = req.session;
    const taskSchema = z.object({
        title: z.string().min(2),
        description: z.string().min(2),
        status: z.enum(["PENDING", "STARTED", "COMPLETED", "CANCELLED"]).optional(),
    });
    const partial = taskSchema.partial();
    const validateField = partial.safeParse(req.body);
    if (!validateField.success) {
        throw new ApiError(400, "Invalid or missing required field");
    }
    const isAceesable = await prisma.employee.findFirst({
        where: {
            user_id: user.id,
            organisation_id: org_id
        }
    });
    if (!isAceesable || isAceesable.status === "USER" && isAceesable.permissions != "WRITE") {
        throw new ApiError(403, "You don't have permission to create task");
    }
    const task = await prisma.task.update({
        where: {
            id: task_id,
        },
        data: {
            ...validateField.data,
        },
    });
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});
const deleteTask = asyncHandler(async (req, res) => {
    const { task_id, org_id } = req.params;
    const user = req.session;
    console.log(org_id, task_id);
    if (!org_id || !task_id) {
        throw new ApiError(400, "Organization ID and task id is required");
    }
    const isAceesable = await prisma.employee.findFirst({
        where: {
            user_id: user.id,
            organisation_id: org_id
        }
    });
    if (!isAceesable || isAceesable.status === "USER" && isAceesable.permissions != "WRITE") {
        throw new ApiError(403, "You don't have permission to create task");
    }
    const task = await prisma.task.delete({
        where: {
            id: task_id,
        },
    });
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    return res.status(200).json(new ApiResponse(200, task, "Task deleted successfully"));
});
export { createTask, deleteTask, updateTask, getTask };
