import type { ImagePlaceholder } from './placeholder-images';

export type Job = {
  id: string;
  ownerId: string; // Added to track job owner
  title: string;
  companyName: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'Пурра' | 'Нопурра' | 'Шартномавӣ' | 'Таҷрибаомӯзӣ';
  description: string;
  responsibilities: string[];
  qualifications: string[];
  companyLogo: ImagePlaceholder;
  postedDate: string;
  views: number;
  status: 'open' | 'filled';
};

export type Message = {
    jobId: string;
    from: 'seeker' | 'employer';
    text: string;
    timestamp: number;
};

export type User = {
    id: string;
    name: string;
    email: string;
    accountType: 'seeker' | 'employer';
    phone: string;
    birthDate: string; // Storing as ISO string
} | null;

export type StoredUser = {
    id: string;
    name: string;
    email: string;
    password?: string;
    accountType: 'seeker' | 'employer';
    phone: string;
    birthDate: string;
};
