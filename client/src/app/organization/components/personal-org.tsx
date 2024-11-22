"use client";

import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateOrganizationDialog from "./create-org";

import { useGetPersonalOrganizations } from "../hooks/organization/get-organisation";
import { useStore } from "@/providers/store-providers";
import { useRouter } from "next/navigation";


export default function YourOrganizationsTab(){  
   



  const {data,isLoading} = useGetPersonalOrganizations()
  const {addCreatedOrg,addJoinedOrg,createdOrg,joinedOrg} = useStore((data) =>data);

  const Router = useRouter()
  useEffect(() => {
    if (data) {
      addCreatedOrg(data.createdOrganizations);
      addJoinedOrg(data.joinedOrganizations);
    }
  },[data])

  const onClick = (id: string) => {
    Router.push(`/organization/${id}`)
  }
 
  if(isLoading) return <div>Loading...</div>
  return (
   
   
    
    <>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
      
      <CreateOrganizationDialog/>
    </div>
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Created Organizations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {createdOrg && createdOrg.map((org) => (
            <Card key={org.id} onClick={() => onClick(org.id)}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Created by:{org.created_by.name}</p>
                <p className="text-sm font-medium mt-2">Sector: {org.sector}</p>
              </CardContent>
             
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Joined Organizations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {joinedOrg && joinedOrg.map((org) => (
            <Card key={org.id} onClick={() => onClick(org.id)}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">CreatedBy: {org.created_by.name}</p>
                <p className="text-sm font-medium mt-2">Sector: {org.sector}</p>
              </CardContent>
              
            </Card>
          ))}
        </div>
      
      </div>
    </div>
  </>
  );
}