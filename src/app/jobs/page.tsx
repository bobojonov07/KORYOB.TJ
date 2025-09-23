'use client';

import JobPostForm from './job-post-form';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function PostJobPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // In a real app, this check would ideally be done in middleware
  // to prevent the page from even rendering.
  useEffect(() => {
    if (isAuthenticated === false) { // check for explicit false, not just falsy (null)
      // We don't redirect, we just show a message.
    }
  }, [isAuthenticated, router]);
  
  if (isAuthenticated === null) {
      // Auth state is still loading
      return (
          <div className="container mx-auto max-w-3xl px-4 py-8 text-center">
              <p>Тафтиши аутентификатсия...</p>
          </div>
      );
  }

  if (!isAuthenticated) {
      return (
          <div className="container mx-auto max-w-md px-4 py-12">
               <Card className="text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Дастрасӣ маҳдуд аст</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-6 text-muted-foreground">
                        Лутфан, барои ҷойгир кардани эълони кор ворид шавед ё ҳисоби нав эҷод кунед.
                    </p>
                    <Button asChild>
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Воридшавӣ
                        </Link>
                    </Button>
                </CardContent>
               </Card>
          </div>
      )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline">Эҷоди ҷои кори нав</h1>
        <p className="text-muted-foreground mt-2">
          Барои ҷойгир кардани ҷои кор ва пайдо кардани номзади мувофиқ варақаи зеринро пур кунед.
        </p>
      </header>
      <JobPostForm />
    </div>
  );
}
