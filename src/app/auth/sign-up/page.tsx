'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signUp(email, password);
            toast({
                title: 'Success!',
                description: 'Please check your email to confirm your account.',
            });
        } catch (error: unknown) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Something went wrong.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-lg mx-auto px-4 py-16">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
                <p className="text-muted-foreground">Sign up to start tracking your habits</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <p className="text-sm text-muted-foreground">
                        Must be at least 8 characters long
                    </p>
                </div>

                <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/sign-in" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-12">
                <Link
                    href="/"
                    className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
