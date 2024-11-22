"use client"
import React,{ useState} from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"


import {  Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input'
import { taskSchema } from '@/types/types'
import { useAddTask } from '../hooks/tasks/create-task'
import toast from 'react-hot-toast'


function TaskForm({id}:{id:string})  {
  const { mutate,isPending } = useAddTask()

    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
    const taskForm = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
          title: "",
          description: "",
          status: "PENDING",
        },
      })


      const onTaskSubmit = async(data: z.infer<typeof taskSchema>) => {
        await mutate({data,org_id:id},{
          onSuccess: () =>{
            toast.success("Task created successfully")
          },
          onSettled: () => {
            setIsTaskDialogOpen(false)
            taskForm.reset()
          }
        })

      }
  return (
    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
    <DialogTrigger asChild>
      <Button>
        <Plus className="mr-2 h-4 w-4" /> Create New Task
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Task</DialogTitle>
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Task"}</Button>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
  )
}

export default TaskForm