'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  userRole?: string;
  className?: string;
}

export function MobileNav({ items, userRole, className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sheet when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn("h-10 w-10 p-0 lg:hidden", className)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Menu</SheetTitle>
          {userRole && (
            <p className="text-sm text-muted-foreground">
              Logged in as {userRole}
            </p>
          )}
        </SheetHeader>
        <nav className="flex flex-col p-6">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                i > 0 && "mt-1"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}