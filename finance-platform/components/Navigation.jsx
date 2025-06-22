'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import NavButton from './Nav-Button';
import Button from '../components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import useMedia from 'react-use/lib/useMedia';

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia('(max-width: 1024px)');

  const onClick = useCallback(
    async (href) => {
      setIsLoading(true);
      try {
        if (href === '/') {
          const res = await fetch('/api/auth/check', { credentials: 'include' });
          const data = await res.json();
          router.push(data.isAuthenticated ? '/overview' : href);
        } else if (
          ['/overview', '/transactions', '/categories', '/accounts', '/settings'].includes(href)
        ) {
          const res = await fetch('/api/auth/check', { credentials: 'include' });
          const data = await res.json();
          router.push(data.isAuthenticated ? href : '/login');
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
    [router]
  );

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
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
  }, [router]);

  return (
    <>
      <nav className="relative">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-0 outline-none text-white focus:bg-white/30 transition p-2"
                disabled={isLoading}
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
                      className={`w-full justify-start text-white hover:bg-blue-500 hover:text-white transition text-base py-3 ${
                        route.href === pathname ? 'border border-white rounded-md' : ''
                      }`}
                      onClick={() => onClick(route.href)}
                      disabled={isLoading}
                    >
                      {route.label}
                    </Button>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-600 hover:text-white transition text-base py-3"
                  onClick={handleLogout}
                  disabled={isLoading}
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
                disabled={isLoading}
              />
            ))}
            <Button
              variant="outline"
              className="font-normal text-red-600 hover:bg-red-600 hover:text-white border-red-600 focus:ring-0 outline-none transition"
              onClick={handleLogout}
              disabled={isLoading}
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
