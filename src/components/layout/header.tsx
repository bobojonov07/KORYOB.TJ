'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, Bookmark, LogIn, UserPlus, LogOut, UserCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from '../ui/avatar';


const desktopNavLinks = [
  { href: '/', label: 'Ҷойҳои корӣ', icon: Briefcase, protected: false },
  { href: '/post-job', label: 'Эҷоди ҷои кор', icon: FileText, protected: true, employerOnly: true },
  { href: '/saved-jobs', label: 'Ҷойҳои захирашуда', icon: Bookmark, protected: true, seekerOnly: true },
  { href: '/messages', label: 'Паёмҳо', icon: MessageSquare, protected: true, employerOnly: true },
];

const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} legacyBehavior passHref>
      <a
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </a>
    </Link>
  );
};

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const isEmployer = user?.accountType === 'employer';
  const pathname = usePathname();

  // Hide header on chat page for a more immersive experience
  if (pathname.startsWith('/chat/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Briefcase className="h-6 w-6" />
          <span className="hidden sm:inline">KORYOB TJ</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {desktopNavLinks.map((link) => {
             if (!link.protected || isAuthenticated) {
                if (link.employerOnly && !isEmployer) return null;
                if (link.seekerOnly && isEmployer) return null;
                return <NavLink key={link.href} {...link} />
             }
             return null;
          })}
        </nav>

        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
            {isAuthenticated ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10 border-2 border-primary/50">
                                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Профил</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Баромад</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                <Button variant="ghost" asChild>
                    <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Воридшавӣ
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Бақайдгирӣ
                    </Link>
                </Button>
                </>
            )}
            </div>
        </div>
      </div>
    </header>
  );
}
