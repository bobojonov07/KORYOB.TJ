'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Camera } from 'lucide-react';
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Ном бояд на камтар аз 2 ҳарф бошад.'),
  email: z.string().email('Лутфан, почтаи электронии дурустро ворид кунед.'),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Пароли ҷорӣ зарур аст.'),
    newPassword: z.string().min(8, 'Пароли нав бояд на камтар аз 8 аломат дошта бошад.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Паролҳои нав мувофиқат намекунанд.',
    path: ['confirmPassword'],
  });

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, isAuthenticated, updateUser, changePassword } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, profileForm]);

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    updateUser(values);
    toast({
      title: 'Профил навсозӣ шуд!',
      description: 'Маълумоти профили шумо бомуваффақият захира карда шуд.',
    });
  }

  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    const result = changePassword(values.currentPassword, values.newPassword);
     if (result.success) {
        toast({
        title: 'Парол тағйир дода шуд!',
        description: 'Пароли шумо бомуваффақият навсозӣ шуд.',
        });
        passwordForm.reset();
    } else {
        toast({
        title: 'Хатогӣ дар ивази парол',
        description: result.error,
        variant: 'destructive',
        });
    }
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
                      Лутфан, барои дидани профили худ ворид шавед.
                  </p>
                  <Button asChild>
                      <Link href="/login">
                          Воридшавӣ
                      </Link>
                  </Button>
              </CardContent>
             </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <UserCircle className="h-8 w-8" />
          Профили ман
        </h1>
        <p className="text-muted-foreground mt-2">
          Маълумоти шахсӣ ва танзимоти ҳисоби худро идора кунед.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Сурати профил</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                   {/* In a real app, you would use AvatarImage with user's photo */}
                  <AvatarFallback className="text-4xl">
                    {user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-1 right-1 rounded-full h-8 w-8">
                    <Camera className="h-4 w-4"/>
                    <span className="sr-only">Тағйир додани сурат</span>
                </Button>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Барои навсозии сурати худ клик кунед.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Маълумоти шахсӣ</CardTitle>
              <CardDescription>
                Ном ва почтаи электронии худро навсозӣ кунед.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Номи пурра</FormLabel>
                        <FormControl>
                          <Input placeholder="Номи шумо" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Почтаи электронӣ</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                            readOnly
                            className="text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Захира кардан</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Тағйир додани парол</CardTitle>
              <CardDescription>
                Барои амнияти бештар пароли худро мунтазам нав кунед.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароли ҷорӣ</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пароли нав</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тасдиқи пароли нав</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Тағйир додани парол</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
