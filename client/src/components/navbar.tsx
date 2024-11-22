import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Building2, MenuIcon } from 'lucide-react'
import { Button } from './ui/button'

const menuItems = [
  { title: "Menu", href: "/" },
  { title: "Organizations", href: "organization" },
]
function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <Link className="flex items-center justify-center" href="/">
            <Building2 className="h-6 w-6" />
            <span className="ml-2 text-lg font-bold">Velo</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {menuItems.map((item) => (
              <Link key={item.title} className="text-sm font-medium hover:underline underline-offset-4" href={item.href}>
                {item.title}
              </Link>
            ))}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link href={item.href}>{item.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
  )
}

export default Navbar