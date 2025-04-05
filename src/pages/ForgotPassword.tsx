import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate sending a reset password email
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Reset email sent",
                description: "Check your inbox for the reset password instructions.",
            });
            // Optionally reset the email field or redirect the user
            setEmail('');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary bg-login-background bg-cover p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-6"
            >
                <div className="w-full flex justify-center mb-6">
                    <img src="/logo/sm_logo.png" alt="Showmates Logo" className="h-12" />
                </div>
                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Sending..." : "Send Reset Email"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="text-center text-sm">
                        <div className="mx-auto">
                            Remember your password?{" "}
                            <Link to="/login" className="font-medium text-primary">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <div className="text-center mt-6 text-sm text-gray-500">
                    Enter your email and we'll send you instructions to reset your password.
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
