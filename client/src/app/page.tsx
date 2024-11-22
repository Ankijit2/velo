"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {  Users, Building2, CheckSquare, ArrowRight } from 'lucide-react'
import Link from "next/link"


const keyFeatures = [
  { icon: Users, title: "User Management", description: "Easily add, remove, and manage users across your organization." },
  { icon: Building2, title: "Department Organization", description: "Create and manage departments with dedicated admins for each." },
  { icon: CheckSquare, title: "Task Assignment", description: "Assign and track tasks efficiently within departments." },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-4">
              Streamline Your Organization with Velo
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-4">
              Empower your team, manage departments, and boost productivity with our intuitive platform.
            </p>
            <div className="flex justify-center space-x-4">
              <Button>Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24  bg-gray-100 dark:bg-gray-800">
          <div className=" px-4 md:px-6 w-full">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid mt-16 gap-8 place-items-center sm:grid-cols-2 lg:grid-cols-3">
              {keyFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <feature.icon className="h-6 w-6 mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Ready to Transform Your Organization?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 mb-4">
              Join Velo today and experience the power of streamlined management.
            </p>
            <Button className="inline-flex items-center">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
      <footer className="flex flex-col sm:flex-row justify-between items-center py-6 px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Velo. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6 mt-2 sm:mt-0">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}