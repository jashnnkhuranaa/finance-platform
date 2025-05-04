'use client';

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "./Nav-Button";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useMedia } from "react-use";
import Link from "next/link";

const routes = [
  { href: "/", label: "Home" },
  { href: "/overview", label: "Overview" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
  { href: "/accounts", label: "Accounts" },
  { href: "/settings", label: "Settings" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = async (href: string) => {
    if (href === "/") {
      const res = await fetch('/api/auth/check', { credentials: 'include' });
      const data = await res.json();
      if (data.isAuthenticated) {
        router.push("/overview");
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      router.push('/');
      setIsOpen(false);
    }
  };

  return (
    <nav>
      {isMobile ? (
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
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden lg:flex items-center gap-4 flex-wrap">
          {routes.map((route) => (
            <NavButton
              key={route.href}
              href={route.href}
              label={route.label}
              isActive={pathname === route.href}
              onClick={() => onClick(route.href)}
            />
          ))}
          <Button
            variant="outline"
            className="font-normal text-red-600 hover:bg-red-600 hover:text-white border-red-600 focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};