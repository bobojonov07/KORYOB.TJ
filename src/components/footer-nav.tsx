'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Bookmark, PlusSquare, MessageSquare, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

export default function FooterNav() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const isEmployer = user?.accountType === 'employer';

  const navLinks = [
    { href: '/', label: 'Ҷойҳо', icon: Briefcase, protected: false },
    { href: '/saved-jobs', label: 'Захираҳо', icon: Bookmark, protected: true, seekerOnly: true },
    ...(isEmployer ? [{ href: '/messages', label: 'Паёмҳо', icon: MessageSquare, protected: true, employerOnly: true }] : []),
    { href: '/post-job', label: 'Эҷод', icon: PlusSquare, protected: true, employerOnly: true, isCentral: true },
    { href: '/profile', label: 'Профил', icon: UserCircle, protected: true },
  ];

  const NavLink = ({ href, label, icon: Icon, isCentral, isActive }: { href: string; label: string; icon: React.ElementType; isCentral?: boolean, isActive: boolean }) => {
    return (
      <Link href={href} className={cn(
        "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
        isCentral && "transform -translate-y-4"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-full transition-all",
           isCentral ? "bg-primary text-primary-foreground h-16 w-16 shadow-lg border-4 border-background" : "h-8 w-12"
        )}>
          <Icon className={cn(isCentral ? "h-7 w-7" : "h-6 w-6")} />
        </div>
        <span className={cn("text-xs", isCentral && "font-semibold text-foreground -mt-3")}>{label}</span>
      </Link>
    );
  };
  
  if (pathname.startsWith('/chat/')) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 bg-card border-t md:hidden">
      <div className="container mx-auto h-full max-w-lg">
        <div className="grid h-full grid-cols-5 items-stretch">
          {navLinks.map((link) => {
            if (!link.protected || isAuthenticated) {
              if (link.employerOnly && !isEmployer) {
                 if (link.isCentral) { // Keep placeholder for layout
                    return <div key={link.href} className="flex items-center justify-center"></div>
                 }
                 return null;
              }
              if (link.seekerOnly && isEmployer) {
                return null;
              }

              // Adjust grid for seeker view
              const seekerLinks = navLinks.filter(l => !l.employerOnly || l.href === '/profile');
              const employerLinks = navLinks.filter(l => l.seekerOnly !== true);
              const currentLinks = isEmployer ? employerLinks : seekerLinks;

              const isVisible = currentLinks.some(l => l.href === link.href);
              if (!isVisible && !link.isCentral) return null;

              if (!isEmployer && link.href === '/post-job') {
                  return <div key="placeholder-post-job"></div>;
              }


              return (
                <div key={link.href} className={cn("flex items-center justify-center", link.isCentral && 'relative')}>
                   <NavLink {...link} isActive={pathname === link.href} />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </footer>
  );
}
