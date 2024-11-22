/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useGetNonOrgEmployess } from "../hooks/organization/get-non-org-users"
import { useAddOrgEmployee } from "../hooks/organization/add-org-employ"
import toast from "react-hot-toast"
// Mock user data


export default function AddUsers({id}: { id: string }) {
    const { data,refetch } = useGetNonOrgEmployess(id)
  const [open, setOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
 
const { mutate, isPending } = useAddOrgEmployee()

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAddUsers = () => {
    mutate({ org_id: id, added_user_id: selectedUsers },{
      onSuccess: () => {
        toast.success("Users added successfully")
      },
      onSettled: () => {
        setOpen(false)
        refetch()
        setSelectedUsers([])
          
      }
    })
   
    // Here you would typically do something with the selected users,
    // such as adding them to a list or sending them to an API
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Select Users</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Users</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {data && data.map((user:any) => (
            <div key={user.id} className="flex items-center space-x-4 py-2">
              <Checkbox
                id={`user-${user.id}`}
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={() => handleUserToggle(user.id)}
              />
              <label
                htmlFor={`user-${user.id}`}
                className="flex items-center space-x-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Avatar>
                  <AvatarFallback>{user.name.split(' ').map((n:string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p>{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </label>
            </div>
          ))}
        </ScrollArea>
        <Button onClick={handleAddUsers} className="mt-4" disabled={isPending}>
          {isPending ? "Adding..." : "Add Users"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

