'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Ном бояд на камтар аз 2 ҳарф бошад." }),
  lastName: z.string().min(2, { message: "Насаб бояд на камтар аз 2 ҳарф бошад." }),
  email: z.string().email({ message: "Лутфан, почтаи электронии дурустро ворид кунед." }),
  password: z.string().min(8, { message: "Парол бояд на камтар аз 8 аломат дошта бошад." }),
  accountType: z.enum(["seeker", "employer"], { required_error: "Лутфан, намуди ҳисобро интихоб кунед." }),
  phone: z.string().min(9, { message: "Рақами телефон бояд на камтар аз 9 рақам бошад." }),
  birthDate: z.date({ required_error: "Санаи таваллуд зарур аст." }),
});


export function RegisterForm() {
    const { toast } = useToast();
    const { register } = useAuth();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const { firstName, lastName, ...rest } = values;
        const result = register({
            name: `${firstName} ${lastName}`,
            ...rest
        });
        
        if (result.success) {
            toast({
                title: "Ҳисоб бомуваффақият эҷод шуд!",
                description: "Шумо ба ҳисоби нави худ ворид шудед.",
            });
            router.push('/');
        } else {
             toast({
                title: "Хатогӣ дар сабти ном",
                description: result.error,
                variant: "destructive",
            });
        }
    }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
            <UserPlus /> Эҷоди ҳисоб
        </CardTitle>
        <CardDescription>
          Барои эҷоди ҳисоб маълумоти худро ворид кунед
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ном</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ном" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Насаб</FormLabel>
                                <FormControl>
                                    <Input placeholder="Насаб" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Почтаи электронӣ</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Рақами телефон</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="912345678" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Санаи таваллуд</FormLabel>
                             <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "dd/MM/yyyy")
                                    ) : (
                                        <span>Санаро интихоб кунед</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Парол</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Ман...</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                     <Label
                                        htmlFor="seeker"
                                        className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                        <RadioGroupItem value="seeker" id="seeker" className="peer sr-only" />
                                        Ҷӯяндаи кор
                                    </Label>
                                </FormControl>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                     <Label
                                        htmlFor="employer"
                                        className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                        <RadioGroupItem value="employer" id="employer" className="peer sr-only" />
                                       Корфармо
                                    </Label>
                                </FormControl>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Эҷоди ҳисоб
                </Button>
            </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Аллакай ҳисоб доред?{" "}
          <Link href="/login" className="underline">
            Ворид шавед
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
