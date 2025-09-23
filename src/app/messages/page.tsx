'use client';

import { useAuth } from '@/lib/auth-context';
import { useJobs } from '@/lib/job-context';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn, Inbox } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useMessages } from '@/lib/message-context';
import { groupBy } from 'lodash';

export default function MessagesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { jobs } = useJobs();
  const { messages } = useMessages();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const conversations = useMemo(() => {
    if (!user) return [];

    let relevantJobIds: string[] = [];

    if (user.accountType === 'employer') {
        // For employers, find jobs they own
        relevantJobIds = jobs.filter(j => j.ownerId === user.id).map(j => j.id);
    } else { // seeker
        // For seekers, find jobs they've messaged
        const jobIdsMessagedBySeeker = Object.keys(groupBy(messages, 'jobId'));
        relevantJobIds = jobs.filter(j => jobIdsMessagedBySeeker.includes(j.id)).map(j => j.id);
    }

    const groupedByJob = groupBy(messages, 'jobId');
    
    return relevantJobIds.map(jobId => {
      const jobMessages = groupedByJob[jobId] || [];
      if (jobMessages.length === 0) return null;

      const job = jobs.find(j => j.id === jobId);
      if (!job) return null;

      const lastMessage = jobMessages.sort((a,b) => b.timestamp - a.timestamp)[0];
      
      const unreadCount = jobMessages.filter(m => 
        !m.isRead && m.from !== user.accountType
      ).length;

      const partner = user.accountType === 'employer' 
        ? { name: 'Номзади тасодуфӣ', avatar: `https://i.pravatar.cc/150?u=applicant${jobId}`, fallback: 'Н' }
        : { name: job?.companyName || 'Корфармо', avatar: job?.companyLogo.imageUrl || '', fallback: job?.companyName?.charAt(0) || 'К' };

      return {
        jobId: jobId,
        jobTitle: job?.title || 'Ҷои кори номаълум',
        partner: partner,
        lastMessage: lastMessage?.text || ' henüz mesaj yok.',
        unreadCount: unreadCount,
        timestamp: lastMessage.timestamp
      };
    })
    .filter(Boolean) // Remove nulls
    .sort((a,b) => b.timestamp - a.timestamp); // Show most recent conversations first

  }, [messages, jobs, user]);


  if (isAuthenticated === null) {
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
              Лутфан, барои дидани паёмҳои худ ворид шавед.
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
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Маркази паёмҳо</h1>
        <p className="text-muted-foreground mt-2">
          Сӯҳбатҳои худро бо номзадҳо ё корфармоён идора кунед.
        </p>
      </header>
      
      {conversations.length > 0 ? (
        <Card>
            <CardContent className="p-0">
                <ul className="divide-y">
                    {conversations.map(convo => (
                        <li key={convo.jobId}>
                            <Link href={`/chat/${convo.jobId}`} className="block hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4 p-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={convo.partner.avatar} alt={convo.partner.name} />
                                        <AvatarFallback>{convo.partner.fallback}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold">{convo.partner.name}</p>
                                            {convo.unreadCount > 0 && (
                                                <Badge className="h-6 w-6 flex items-center justify-center">{convo.unreadCount}</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Дар бораи: <span className="font-medium text-foreground">{convo.jobTitle}</span></p>
                                        <p className="text-sm text-muted-foreground truncate mt-1">{convo.lastMessage}</p>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      ): (
        <div className="text-center py-16 bg-card rounded-lg flex flex-col items-center">
            <Inbox className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Паёмҳо нест</h3>
            <p className="text-muted-foreground mt-2 mb-4 max-w-sm mx-auto">
              Вақте ки шумо сӯҳбатро оғоз мекунед ё ба шумо паём менависанд, онҳо дар ин ҷо пайдо мешаванд.
            </p>
            {user?.accountType === 'employer' && (
                 <Button asChild variant="outline">
                    <Link href="/post-job">Эълони корӣ ҷойгир кунед</Link>
                </Button>
            )}
            {user?.accountType === 'seeker' && (
                 <Button asChild variant="outline">
                    <Link href="/">Дидани ҷойҳои корӣ</Link>
                </Button>
            )}
        </div>
      )}

    </div>
  );
}
