'use client';

import { useJobs } from '@/lib/job-context';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin, DollarSign, Clock, MessageSquare, ArrowLeft, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import format from 'date-fns/format';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { jobs, incrementViews, deleteJob, toggleJobStatus } = useJobs();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const job = jobs.find((j) => j.id === params.id);

  useEffect(() => {
    if (params.id && user?.accountType !== 'employer') {
        incrementViews(params.id);
    }
  }, [params.id, incrementViews, user]);

  if (!job) {
    notFound();
  }

  const handleDelete = () => {
    deleteJob(job.id);
    router.push('/');
  };

  const handleToggleStatus = () => {
    toggleJobStatus(job.id);
  }
  
  const postedDate = new Date(job.postedDate);
  const isJobOwner = isAuthenticated && user?.accountType === 'employer' && job.ownerId === user.id;
  const isJobFilled = job.status === 'filled';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6">
          <Button variant="ghost" asChild>
              <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Бозгашт ба ҷойҳои корӣ
              </Link>
          </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 relative">
          {isJobFilled && (
            <Badge variant="destructive" className="absolute top-4 right-4 bg-green-600 text-white border-green-600">
              <CheckCircle className="mr-2 h-4 w-4"/>
              Коргар ёфт шуд
            </Badge>
          )}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Image
              src={job.companyLogo.imageUrl}
              alt={`${job.companyName} logo`}
              width={100}
              height={100}
              data-ai-hint={job.companyLogo.imageHint}
              className="rounded-xl border-4 border-card object-cover"
            />
            <div className="flex-grow">
              <Badge variant={job.type === 'Пурра' ? 'default' : 'secondary'} className="mb-2">{job.type}</Badge>
              <h1 className="text-3xl font-bold font-headline">{job.title}</h1>
              <p className="text-lg text-muted-foreground">{job.companyName}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{job.salary.min} - {job.salary.max} {job.salary.currency}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                       Нашр шуд {format(postedDate, "d MMMM yyyy")}
                    </span>
                </div>
                {isJobOwner && (
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{job.views} дидан</span>
                    </div>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2 items-end">
              {isAuthenticated && user?.accountType === 'seeker' && (
                <Button asChild size="lg" disabled={isJobFilled}>
                    <Link href={`/chat/${job.id}`}>
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Сӯҳбат бо корфармо
                    </Link>
                </Button>
              )}
               {isJobOwner && (
                <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Оё шумо мутмаин ҳастед?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ин амалро бозпас гирифтан мумкин нест. Ин эълони кориро ба таври доимӣ нест мекунад.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Бекор кардан</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Нест кардан</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant={isJobFilled ? 'secondary' : 'default'} onClick={handleToggleStatus} size="icon">
                        {isJobFilled ? <XCircle className="h-4 w-4"/> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                </div>
               )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-3">Тавсифи кор</h2>
                    <p className="text-foreground/80 whitespace-pre-line">{job.description}</p>
                </div>
                 <div>
                    <h2 className="text-xl font-semibold mb-3">Масъулиятҳо</h2>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80">
                        {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
                 <div>
                    <h2 className="text-xl font-semibold mb-3">Талабот</h2>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80">
                       {job.qualifications.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            </div>
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Дар бораи {job.companyName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Маълумоти бештар дар бораи ширкат дар ин ҷо намоиш дода мешавад.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
