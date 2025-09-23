'use client';

import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJobs } from '@/lib/job-context';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState, useRef } from 'react';
import { useMessages } from '@/lib/message-context';
import { format } from 'date-fns';

export default function ChatPage({ params }: { params: { id: string } }) {
    const { jobs } = useJobs();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { getMessagesForJob, addMessage, markMessagesAsRead } = useMessages();
    
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const job = jobs.find(j => j.id === params.id);
    const messages = getMessagesForJob(params.id);

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);
    
    useEffect(() => {
        markMessagesAsRead(params.id);
    }, [params.id, markMessagesAsRead, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!job) {
        notFound();
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;
        
        addMessage({
            jobId: job.id,
            from: user.accountType,
            text: newMessage,
        });

        setNewMessage('');
    }
    
    const applicantName = 'Номзади тасодуфӣ';
    const applicantFallback = applicantName.charAt(0);

    const chatPartner = user?.accountType === 'employer' 
        ? { name: applicantName, avatar: `https://i.pravatar.cc/150?u=applicant${job.id}`, fallback: applicantFallback }
        : { name: job.companyName, avatar: job.companyLogo.imageUrl, fallback: job.companyName.charAt(0) };


    return (
        <div className="container mx-auto p-0 md:p-4 h-[calc(100vh)] md:h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex-grow flex flex-col bg-card md:rounded-xl shadow-lg overflow-hidden">
                <header className="flex items-center p-4 border-b">
                     <Button variant="ghost" size="icon" className="mr-2" asChild>
                        <Link href={user?.accountType === 'employer' ? '/messages' : `/jobs/${params.id}`}>
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={chatPartner.avatar} alt={chatPartner.name} />
                        <AvatarFallback>{chatPartner.fallback}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                        <p className="font-semibold">{chatPartner.name}</p>
                        <p className="text-sm text-muted-foreground">Ҷавоб дар бораи: {job.title}</p>
                    </div>
                </header>
                <main className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col gap-1 ${msg.from === user?.accountType ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-end gap-2 ${msg.from === user?.accountType ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage 
                                        src={msg.from === 'employer' ? job.companyLogo.imageUrl : `https://i.pravatar.cc/150?u=applicant${job.id}`} 
                                        alt={msg.from === 'employer' ? job.companyName : applicantName} 
                                    />
                                    <AvatarFallback>
                                        {msg.from === 'employer' ? job.companyName.charAt(0) : applicantFallback}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 ${msg.from === user?.accountType ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                             <p className={`text-xs text-muted-foreground mt-1 ${msg.from === user?.accountType ? 'pr-10' : 'pl-10'}`}>
                                {format(new Date(msg.timestamp), 'HH:mm')}
                            </p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </main>
                <footer className="p-4 border-t bg-background sticky bottom-0">
                    <form onSubmit={handleSendMessage} className="relative">
                        <Input 
                            placeholder="Паём нависед..." 
                            className="pr-12" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </footer>
            </div>
        </div>
    )
}
