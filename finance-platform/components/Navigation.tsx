'use client'

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { NavButton } from "./Nav-Button"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useMedia } from "react-use"
import Link from "next/link"

const routes = [
  { href: "/", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
  { href: "/accounts", label: "Accounts" },
  { href: "/settings", label: "Settings" }
]

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMedia("(max-width: 1024px)", false)

  const onClick = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.href === pathname ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onClick(route.href)}
                >
                  {route.label}
                </Button>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  )
}
