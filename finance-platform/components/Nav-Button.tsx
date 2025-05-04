'use client'; // Added since this is a client component

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';

type Props = {
  href: string;
  label: string;
  isActive?: boolean;
  onClick: () => void; // Added onClick prop
};

export const NavButton = ({ href, label, isActive, onClick }: Props) => {
  return (
    <Button
      asChild
      size="default"
      variant="outline"
      className={cn(
        'justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition',
        isActive ? 'bg-white/10 text-white' : 'bg-transparent'
      )}
      onClick={onClick} // Pass onClick to Button
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};