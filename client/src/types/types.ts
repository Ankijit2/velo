import { z } from "zod";
import { Prisma } from "@prisma/client";


export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const SignupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export const createOrgSchema = z.object({
    name: z.string().min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
    sector: z.string().min(2, {
      message: "Sector must be at least 2 characters.",
    }),
  })

  export const OrganisationWithFounder = Prisma.validator<Prisma.OrganisationDefaultArgs>()({
    include: {
      created_by: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  
  export type OrganisationWithFounder = Prisma.OrganisationGetPayload<typeof OrganisationWithFounder>;

  export const EmployeeWithUser = Prisma.validator<Prisma.EmployeeDefaultArgs>()({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
  }
  })

  
 
 
  

  export const taskSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(2),
    status: z.enum(["PENDING", "STARTED", "COMPLETED", "CANCELLED"]).optional(),
  });

  export type EmployeeWithUser = Prisma.EmployeeGetPayload<typeof EmployeeWithUser>;
  