/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Trash2 } from "lucide-react";
import { useGetTasks } from "../hooks/tasks/get-task";
import { EditTaskForm } from "./edit-task-dialog";
import { useDeleteTask } from "../hooks/tasks/delete-task";
import toast from "react-hot-toast";
import { useStore } from "@/providers/store-providers";
export const TaskComponent = ({id}:{id:string}) => {
  const {currentUser} = useStore((state) => state)
  const {mutate} = useDeleteTask()
    const {data,isLoading} = useGetTasks(id)
    if(isLoading){
        return <div>Loading...</div>
    }
   


    const onDelete = async(taskId: string) => {
        await mutate({org_id:id,task_id:taskId},{
            onSuccess: () => {
              toast.success("Task deleted successfully")
            },
            onError: () => {
              toast.error("Failed to delete task")
            },
        })
    }
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data && data.map((task: any) => {
                return(
                    <Card key={task.id}>
                    <CardHeader>
                      <CardTitle>{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-2">{task.description}</p>
                      <p className="text-sm font-medium mt-2">Status: {task.status}</p>
                      {currentUser?.status === "USER" &&  currentUser?.permissions === "READ"? (
    null
  ) : (
    <div className="flex justify-between items-center mt-4">
                        
                       <EditTaskForm id={id} data={task} />
                        <Button variant="outline" size="sm" onClick={() => onDelete(task.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
  )}
                      
                    </CardContent>
                  </Card>
                )
              
                
            })}
    
        </div>
    )
}