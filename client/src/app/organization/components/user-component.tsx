import { EmployeeWithUser } from '@/types/types'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, UserMinus, Mail, UserCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAddAdmin } from '../hooks/admin/make-admin'
import toast from 'react-hot-toast'
import { useStore } from '@/providers/store-providers'
import { useChangeEmployeeStatus } from '../hooks/organization/update-employe-status'
import { useDeleteEmployee } from '../hooks/organization/remove-org-employ'

interface UserCardProps {
  
  Employee: EmployeeWithUser
}




function UserCard({ Employee}: UserCardProps) {
  const addAdmin= useAddAdmin()
  const changeEmployeeStatus = useChangeEmployeeStatus()

  const { currentUser } = useStore((state) => state)
  const deleteUser = useDeleteEmployee()
 
  const handleAddAdmin = async (organization_id: string, employee_id: string) => {
    await addAdmin.mutate({organization_id, employee_id},{
      onSuccess: () => {
        toast.success("Admin added successfully")
      },
      onError: (error) => {
        toast.error("Failed to add admin")
        console.error(error)
      }
    })
  }

  const handleRemoveUser = async (org_id: string, employee_id: string) => {
    await deleteUser.mutate({org_id, employee_id},{
      onSuccess: () => {
        toast.success("User removed successfully")
      },
      onError: (error) => {
        toast.error("Failed to remove user")
        console.error(error)
      }
    })
  }

  const toggleStatus = async(org_id: string, employee_id: string, status: string) =>{
    await changeEmployeeStatus.mutate({org_id,employee_id, status},{
      onSuccess: () => {
        toast.success("Status updated successfully")
      }
    })
  }
  return (
    <Card key={Employee.id} className="">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${Employee.user.name}`} alt={Employee.user.name!} />
          <AvatarFallback><UserCircle className="w-8 h-8" /></AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-xl">{Employee.user.name}</CardTitle>
          <p className="text-sm text-muted-foreground flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            {Employee.user.email}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {currentUser && currentUser.status !== "USER" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => handleRemoveUser(Employee.organisation_id, Employee.id)}>
                <UserMinus className="w-4 h-4 mr-2" /> Kick Out
              </Button>
              <Select
                defaultValue={Employee.permissions || "READ"}
                onValueChange={(value) => toggleStatus(Employee.organisation_id, Employee.id, value)}
              >
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Permission" />
                </SelectTrigger>
                <SelectContent  >
                  <SelectItem value="READ">Read</SelectItem>
                  <SelectItem value="WRITE">Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleAddAdmin(Employee.organisation_id, Employee.id)}
              className="w-full"
            >
              <ShieldCheck className="w-4 h-4 mr-2" /> Make Admin
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UserCard