"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import * as z from "zod";
import toast from "react-hot-toast";
import { useCreateOrganization } from "../hooks/organization/create-organisation";
import { createOrgSchema } from "@/types/types";
export default function CreateOrganizationDialog() {

    const form = useForm<z.infer<typeof createOrgSchema>>({
      resolver: zodResolver(createOrgSchema),
      defaultValues: {
        name: "",
        sector: "",
      },
    })
    const {mutate,isPending}=useCreateOrganization()
  
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const onSubmit = async (data: z.infer<typeof createOrgSchema>) => {
      
        mutate(data, {
            onSuccess: async () => {
             
              toast.success("Organization created successfully");
            },
            onError: () => {
             
              toast.error("An error occurred.");
            },
            onSettled: () => {
             
              form.reset();
              setIsDialogOpen(false);
            },
          });
          
      
    }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Organization</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sector</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter organization sector" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Organization"}</Button>
                  </form>
                </Form>
              </DialogContent>
    </Dialog>

  );

}
