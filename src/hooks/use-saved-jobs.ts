"use client";

import { useState, useEffect, useCallback } from 'react';

const SAVED_JOBS_KEY = 'savedJobs';

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(SAVED_JOBS_KEY);
      if (item) {
        setSavedJobs(JSON.parse(item));
      }
    } catch (error) {
      console.error("Failed to parse saved jobs from localStorage", error);
      setSavedJobs([]);
    }
  }, []);

  const updateSavedJobs = (newSavedJobs: string[]) => {
    try {
      setSavedJobs(newSavedJobs);
      window.localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(newSavedJobs));
    } catch (error) {
      console.error("Failed to save jobs to localStorage", error);
    }
  };

  const addJob = useCallback((jobId: string) => {
    if (!savedJobs.includes(jobId)) {
      updateSavedJobs([...savedJobs, jobId]);
    }
  }, [savedJobs]);

  const removeJob = useCallback((jobId: string) => {
    const newSavedJobs = savedJobs.filter((id) => id !== jobId);
    updateSavedJobs(newSavedJobs);
  }, [savedJobs]);

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobs.includes(jobId);
  }, [savedJobs]);

  const toggleSaveJob = useCallback((jobId: string) => {
    if (isJobSaved(jobId)) {
      removeJob(jobId);
    } else {
      addJob(jobId);
    }
  }, [isJobSaved, addJob, removeJob]);

  return { savedJobs, toggleSaveJob, isJobSaved, addJob, removeJob };
};
