"use client";

import { useEffect } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useGetAvailableOrganizations } from "../hooks/organization/get-organisation";
import { useJoinOrg } from "../hooks/organization/join-org";
import { useStore } from "@/providers/store-providers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function OtherOrganizationsTab( ) {
  const { addOtherOrg,otherOrg } = useStore((state) => state);

  const {data,isLoading} = useGetAvailableOrganizations()
  const {mutate,isPending} = useJoinOrg()
  const router = useRouter()

  
  useEffect(() => {
    if(data){
      addOtherOrg(data)
    }

  },[data])

  if(isLoading ){
    return <div>Loading...</div>
  }
 const handleJoin = async(org_id: string) => {
  mutate(org_id,{
    onSuccess: () => {
     router.push(`/organization/${org_id}`)
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred.");
    }
  })

 }


  return (
    <div>
    
       
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otherOrg.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Created by {org.created_by.name}</p>
              <p className="text-sm font-medium mt-2">Sector: {org.sector}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" disabled={isPending} onClick={() => handleJoin(org.id)}>
                <UserPlus className="mr-2 h-4 w-4" /> Join
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
