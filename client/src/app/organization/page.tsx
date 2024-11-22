"use client"

import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { getPersonalOrganizations } from "./hooks/organization/get-organisation"
import OtherOrganizationsTab from "./components/other-org"
import YourOrganizationsTab from "./components/personal-org"




// Sample data for organizations



export default function OrganizationPage() {

 


useEffect(() => {
  getPersonalOrganizations()
}, [])


 

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Organizations</h1>
      <Tabs defaultValue="your-organizations" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="your-organizations">Your Organizations</TabsTrigger>
          <TabsTrigger value="other-organizations">Other Organizations</TabsTrigger>
          
        </TabsList>
        <TabsContent value="your-organizations">
      <YourOrganizationsTab/>
        </TabsContent>
        <TabsContent value="other-organizations">
         <OtherOrganizationsTab/>
        </TabsContent>
      </Tabs>
    </div>
  )
}