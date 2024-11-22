/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { taskSchema } from "@/types/types"
import { useUpdateTask } from "../hooks/tasks/update-task"
import toast from "react-hot-toast"
import { Edit } from "lucide-react"

export function EditTaskForm({ id, data }: { id: string; data: any }) {
  const { mutate, isPending } = useUpdateTask()

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  const taskForm = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      status: data.status,
    },
  })

  // Watch all form fields
  const watchedValues = useWatch({
    control: taskForm.control,
  })

  // Check if form values are changed
  const isFormChanged =
    watchedValues.title !== data.title ||
    watchedValues.description !== data.description ||
    watchedValues.status !== data.status

  const onTaskSubmit = async (formData: z.infer<typeof taskSchema>) => {
    await mutate(
      { data: formData, org_id: id,task_id:data.id },
      {
        onSuccess: () => {
          toast.success("Task updated successfully")
        },
        onError: () => {
          toast.error("Failed to update task")
        },
        onSettled: () => {
          setIsTaskDialogOpen(false)
          taskForm.reset()
        },
      }
    )
  }

  return (
    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...taskForm}>
          <form onSubmit={taskForm.handleSubmit(onTaskSubmit)} className="space-y-4">
            <FormField
              control={taskForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={taskForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={taskForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="STARTED">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isFormChanged || isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
