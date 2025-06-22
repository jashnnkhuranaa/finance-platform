'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// import { useMediaQuery } from 'react-use';
import  NavButton  from './Nav-Button';
import Link from 'next/link';
// import { NavButton } from '@/components/Nav-Button';
import  Button  from '../components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useMediaQuery } from 'react-use';
import useMedia from 'react-use/lib/useMedia';


// Simple CSS for spinner loader (customize as needed)
const spinnerStyles = `
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #fff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const routes = [
  { href: '/', label: 'Home' },
  { href: '/overview', label: 'Overview' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/categories', label: 'Categories' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/settings', label: 'Settings' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loader
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia('(max-width: 1024px)');


  // Memoize onClick to avoid recreating function
  const onClick = useCallback(
    async (href) => {
      setIsLoading(true);
      try {
        if (href === '/') {
          const res = await fetch('/api/auth/check', { credentials: 'include' });
          const data = await res.json();
          console.log('Navigation Auth Check:', data);
          if (data.isAuthenticated) {
            router.push('/overview');
          } else {
            router.push(href);
          }
        } else if (['/overview', '/transactions', '/categories', '/accounts', '/settings'].includes(href)) {
          const res = await fetch('/api/auth/check', { credentials: 'include' });
          const data = await res.json();
          console.log('Navigation Auth Check for Protected Route:', data);
          if (data.isAuthenticated) {
            router.push(href);
          } else {
            console.log('Navigation: Not authenticated, redirecting to /login');
            router.push('/login');
          }
        } else {
          router.push(href);
        }
      } catch (error) {
        console.error('Navigation Error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
        setIsOpen(false);
      }
    },
    [router],
  );

  const handleLogout = useCallback(
    async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        if (res.ok) {
          console.log('Logout successful, redirecting to /');
          router.push('/');
          setIsOpen(false);
        } else {
          console.error('Logout failed:', await res.json());
        }
      } catch (error) {
        console.error('Logout Error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return (
    <>
      {/* Inject spinner styles */}
      <style jsx global>{spinnerStyles}</style>
      <nav className="relative">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="spinner"></div>
          </div>
        )}
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition p-2"
                disabled={isLoading} // Disable while loading
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px] p-4 bg-blue-700 text-white">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-y-3 pt-6">
                {routes.map((route) => (
                  <Link key={route.href} href={route.href} passHref legacyBehavior>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-white hover:bg-blue-500 hover:text-white transition-colors duration-200 text-base py-3 ${
                        route.href === pathname ? 'border border-white rounded-md' : ''
                      }`}
                      onClick={() => onClick(route.href)}
                      disabled={isLoading} // Disable while loading
                    >
                      {route.label}
                    </Button>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-600 hover:text-white transition-colors text-base py-3"
                  onClick={handleLogout}
                  disabled={isLoading} // Disable while loading
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
                disabled={isLoading} // Disable while loading
              />
            ))}
            <Button
              variant="outline"
              className="font-normal text-red-600 hover:bg-red-600 hover:text-white border-red-600 focus:ring-offset-0 focus:ring-transparent outline-none transition"
              onClick={handleLogout}
              disabled={isLoading} // Disable while loading
            >
              Logout
            </Button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;