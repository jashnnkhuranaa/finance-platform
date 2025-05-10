'use client';

   import { useState } from "react";
    //new comment added //new comment added //new comment added
   import { useRouter, usePathname } from "next/navigation";
   import Link from "next/link";
   import NavButton from "@/components/Nav-Button";
   import Button from "@/components/ui/button";
   import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
   import { Menu } from "lucide-react";
   import { useMedia } from "react-use";

   const routes = [
     { href: "/", label: "Home" },
     { href: "/overview", label: "Overview" },
     { href: "/transactions", label: "Transactions" },
     { href: "/categories", label: "Categories" },
     { href: "/accounts", label: "Accounts" },
     { href: "/settings", label: "Settings" },
   ];

   const Navigation = () => {
     const [isOpen, setIsOpen] = useState(false);
     const router = useRouter();
     const pathname = usePathname();
     const isMobile = useMedia("(max-width: 1024px)", false);

     const onClick = async (href) => {
       try {
         if (href === "/") {
           const res = await fetch('/api/auth/check', { credentials: 'include' });
           const data = await res.json();
           console.log("Navigation Auth Check:", data);
           if (data.isAuthenticated) {
             router.push("/overview");
           } else {
             router.push(href);
           }
         } else if (["/overview", "/transactions", "/categories", "/accounts", "/settings"].includes(href)) {
           const res = await fetch('/api/auth/check', { credentials: 'include' });
           const data = await res.json();
           console.log("Navigation Auth Check for Protected Route:", data);
           if (data.isAuthenticated) {
             router.push(href);
           } else {
             console.log("Navigation: Not authenticated, redirecting to /login");
             router.push("/login");
           }
         } else {
           router.push(href);
         }
       } catch (error) {
         console.error("Navigation Error:", error.message);
         router.push("/login");
       }
       setIsOpen(false);
     };

     const handleLogout = async () => {
       try {
         const res = await fetch('/api/auth/logout', {
           method: 'POST',
           credentials: 'include',
         });
         if (res.ok) {
           console.log("Logout successful, redirecting to /");
           router.push('/');
           setIsOpen(false);
         } else {
           console.error("Logout failed:", await res.json());
         }
       } catch (error) {
         console.error("Logout Error:", error.message);
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
                 className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition p-2"
               >
                 <Menu className="size-6" />
               </Button>
             </SheetTrigger>
             <SheetContent side="left" className="w-[250px] sm:w-[300px] p-4 bg-blue-700 text-white">
               <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
               <nav className="flex flex-col gap-y-3 pt-6">
                 {routes.map((route) => (
                   <Link key={route.href} href={route.href}>
                     <Button
                       variant="ghost"
                       className={`w-full justify-start text-white hover:bg-blue-500 hover:text-white transition-colors duration-200 text-base py-3 ${
                         route.href === pathname ? 'border border-white rounded-md' : ''
                       }`}
                       onClick={() => onClick(route.href)}
                     >
                       {route.label}
                     </Button>
                   </Link>
                 ))}
                 <Button
                   variant="ghost"
                   className="w-full justify-start text-red-600 hover:bg-red-600 hover:text-white transition-colors text-base py-3"
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

   export default Navigation;