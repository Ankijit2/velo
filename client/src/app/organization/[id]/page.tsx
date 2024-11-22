'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2,Search } from 'lucide-react'
import { EmployeeWithUser } from "@/types/types"
import { useGetOrgEmployess } from "../hooks/organization/get-org-employes"
import UserCard from "../components/user-component"
import AdminCard from "../components/admin-component"
import AddUsers from "../components/add-users"
import TaskForm from "../components/task-dialog"
import { TaskComponent } from "../components/org-task"
import { useDeleteOrg } from "../hooks/organization/add-del-org"

import { useStore } from "@/providers/store-providers"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"



export default function Component({
  params: { id },
}: {
  params: { id: string };
}) {
 
  const{currentUser,addCurrentUser} = useStore((state) => state);
 
const {mutate} = useDeleteOrg()

  const [searchTerm, setSearchTerm] = useState("")

  const { data, isPending } = useGetOrgEmployess(id)
  const router = useRouter()

  useEffect(() => {
    if (data) {
      addCurrentUser(data.currentUser)
    }
  }, [data])
  
  console.log(currentUser)
  



const handleDelete = () => {
  mutate({org_id:id}, {
    onSuccess: () => {
      // Handle success, e.g., show a success message
      toast.success("Organization deleted successfully")
      router.push("/organization")
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
      console.error(error)
    }
  })
}

 



  if (isPending) {
    return <div>Loading...</div>
  }
  if(!data&& !isPending){
    return <>Org not found</>
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organization Details</h1>
        {currentUser?.status ==="SUPERADMIN" && (
          <div>
           
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Organization
              </Button>
            
          </div>
        )}
      </div>
      {data.currentUser?.status !=="SUPERADMIN" && !data.superAdmins ? (
        <>
        <div>
          <p>Organization Founder: {data.superAdmin.user.name}</p>
          <p>Organization Admin Email: {data.superAdmin.user.email}</p>
        </div>
        </>

      ):(
        <div>
          <p>Organization Founder: {currentUser?.user.name}</p>
          <p>Organization Admin Email: {currentUser?.user.email}</p>
        </div>
        )
      

      }
      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="employees">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mr-2"
              />
              <Button onClick={() => setSearchTerm("")}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div>
            {currentUser?.status !== "USER" && (
             <AddUsers id={id}/>

            )}

            </div>
           
            
          </div>
          <div className="space-y-8">
            {currentUser?.status !== "SUPERADMIN" && (
               <div>
               <h1>Your profile</h1>
               <p>Name: {currentUser?.user.name}</p>
               <p>Email: {currentUser?.user.email}</p>
                <p>Your status is: {currentUser?.status}</p>
             </div>
            )}
           
            <div>
              <h2 className="text-2xl font-bold mb-4">Admins</h2>
              {data.admins.map((emp: EmployeeWithUser) => (
                <div key={emp.id}>
                <AdminCard  Employee={emp} />
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              {data.users.map((emp:EmployeeWithUser) => (
                <div key={emp.id}>
                <UserCard  Employee={emp} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tasks">
          <div className="mb-4 flex justify-end">
          {
  currentUser?.status === "USER" &&  currentUser?.permissions === "READ"? (
    null
  ) : (
    <TaskForm id={id} />
  )
}
          </div>
          
           <TaskComponent id={id}/>
   
        </TabsContent>
      </Tabs>
    </div>
  )
}