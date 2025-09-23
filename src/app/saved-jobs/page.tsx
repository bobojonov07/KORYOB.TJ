"use client";

import { useSavedJobs } from '@/hooks/use-saved-jobs';
import { useJobs } from '@/lib/job-context';
import JobCard from '@/components/job/job-card';
import { BookmarkX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SavedJobsPage() {
  const { savedJobs } = useSavedJobs();
  const { jobs } = useJobs();

  const savedJobListings = jobs.filter(job => savedJobs.includes(job.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Ҷойҳои кории захирашуда</h1>
        <p className="text-muted-foreground mt-2">
          Шумо {savedJobListins.length} ҷои кори захирашуда доред.
        </p>
      </header>
      
      {savedJobListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobListings.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg flex flex-col items-center">
          <BookmarkX className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Ҳоло ҷойҳои кории захирашуда нест</h3>
          <p className="text-muted-foreground mt-2 mb-4">Ба дидани ҷойҳои корӣ шурӯъ кунед ва ҷойҳои кории ба шумо мароқоварро захира кунед.</p>
          <Button asChild>
            <Link href="/">
              Дидани ҷойҳои корӣ
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
