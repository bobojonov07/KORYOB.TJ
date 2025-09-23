"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, MapPin, DollarSign, Clock } from 'lucide-react';
import type { Job } from '@/lib/types';
import { useSavedJobs } from '@/hooks/use-saved-jobs';
import { cn } from '@/lib/utils';
import format from 'date-fns/format';

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const saved = isJobSaved(job.id);

  const postedDate = new Date(job.postedDate);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <Link href={`/jobs/${job.id}`} className="flex-grow">
        <CardHeader className="flex flex-row items-start gap-4">
          <Image
            src={job.companyLogo.imageUrl}
            alt={`${job.companyName} logo`}
            width={56}
            height={56}
            data-ai-hint={job.companyLogo.imageHint}
            className="rounded-lg border aspect-square object-cover"
          />
          <div className="flex-grow">
            <CardTitle className="text-lg font-bold hover:text-primary transition-colors">
              {job.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{job.companyName}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-foreground/80">
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
                {format(postedDate, 'dd/MM/yyyy')}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between items-center">
        <Badge variant={job.type === 'Пурра' ? 'default' : 'secondary'}>{job.type}</Badge>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSaveJob(job.id)}
          aria-label={saved ? 'Бекор кардани захира' : 'Захира кардани кор'}
        >
          <Bookmark className={cn("h-5 w-5", saved ? "text-primary fill-primary" : "text-muted-foreground")} />
        </Button>
      </CardFooter>
    </Card>
  );
}
