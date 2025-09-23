'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Job } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { useAuth } from './auth-context';

interface JobContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'ownerId' | 'postedDate' | 'companyLogo' | 'views' | 'responsibilities' | 'qualifications' | 'type' | 'status'>) => void;
  incrementViews: (jobId: string) => void;
  deleteJob: (jobId: string) => void;
  toggleJobStatus: (jobId: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const JOBS_STORAGE_KEY = 'koryob_jobs';

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const storedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs));
      } else {
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Failed to load jobs from localStorage", error);
      setJobs([]);
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify([]));
    }
  }, []);

  const updateJobsStorage = (updatedJobs: Job[]) => {
    setJobs(updatedJobs);
    try {
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
    } catch (error) {
        console.error("Failed to save jobs to localStorage", error);
    }
  };

  const addJob = useCallback((job: Omit<Job, 'id' | 'ownerId' | 'postedDate' | 'companyLogo' | 'views' | 'responsibilities' | 'qualifications' | 'type' | 'status'>) => {
    if (!user) {
        console.error("Cannot add job. User is not authenticated.");
        return;
    }
    setJobs(prevJobs => {
        const newJob: Job = {
            ...job,
            id: (prevJobs.length + 1).toString(),
            ownerId: user.id,
            postedDate: new Date().toISOString(),
            companyLogo: PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)],
            type: 'Пурра', // Defaulting type as it's not in the form
            responsibilities: [
                'Масъулиятҳои асосӣ дар инҷо номбар карда мешаванд.',
                'Иҷрои вазифаҳои муайяншуда дар мӯҳлатҳои муқарраршуда.'
            ],
            qualifications: [
                'Талаботи асосӣ дар инҷо номбар карда мешаванд.',
                'Малакаҳои зарурӣ барои иҷрои вазифа.'
            ], 
            views: 0,
            status: 'open',
        };
        const newJobs = [newJob, ...prevJobs];
        updateJobsStorage(newJobs);
        return newJobs;
    });
  }, [user]);

  const incrementViews = useCallback((jobId: string) => {
    setJobs(prevJobs => {
        const newJobs = prevJobs.map(job => 
            job.id === jobId ? { ...job, views: (job.views || 0) + 1 } : job
        );
        updateJobsStorage(newJobs);
        return newJobs;
    });
  }, []);

  const deleteJob = useCallback((jobId: string) => {
    setJobs(prevJobs => {
        const newJobs = prevJobs.filter(job => job.id !== jobId);
        updateJobsStorage(newJobs);
        return newJobs;
    });
  }, []);

  const toggleJobStatus = useCallback((jobId: string) => {
    setJobs(prevJobs => {
      const newJobs = prevJobs.map(job =>
        job.id === jobId ? { ...job, status: job.status === 'open' ? 'filled' : 'open' } : job
      );
      updateJobsStorage(newJobs);
      return newJobs;
    });
  }, []);


  return (
    <JobContext.Provider value={{ jobs, addJob, incrementViews, deleteJob, toggleJobStatus }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
