'use client';

import JobList from '@/components/job/job-list';
import { useJobs } from '@/lib/job-context';

export default function Home() {
  const { jobs } = useJobs();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
          Кори Орзуи Худро Пайдо Кунед
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          KORYOB TJ - платформаи №1 барои дарёфти ҷойҳои корӣ дар Тоҷикистон. Ҳазорон ҷойҳои кориро аз ширкатҳои пешсаф кашф кунед.
        </p>
      </header>
      <JobList jobs={jobs} />
    </div>
  );
}
