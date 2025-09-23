'use client';

import Link from "next/link"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { LogIn } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Лутфан, почтаи электронии дурустро ворид кунед." }),
  password: z.string().min(1, { message: "Лутфан, паролро ворид кунед." }),
});

export function LoginForm() {
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = login(values.email, values.password);
    if(result.success) {
        toast({
            title: "Шумо бомуваффақият ворид шудед!",
            description: "Хуш омадед ба KORYOB TJ.",
        });
        router.push('/');
    } else {
        toast({
            title: "Хатогӣ дар воридшавӣ",
            description: result.error,
            variant: "destructive",
        });
    }
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <LogIn /> Воридшавӣ
        </CardTitle>
        <CardDescription>
          Барои ворид шудан ба ҳисоби худ почтаи электронии худро дар зер ворид кунед
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                             <div className="flex items-center">
                                <FormLabel>Парол</FormLabel>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Пароли худро фаромӯш кардед?
                                </Link>
                            </div>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Воридшавӣ
                </Button>
                <Button variant="outline" className="w-full" type="button">
                    Воридшавӣ бо Google
                </Button>
            </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Ҳисоб надоред?{" "}
          <Link href="/register" className="underline">
            Ба қайд гиред
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
