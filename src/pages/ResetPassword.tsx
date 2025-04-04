// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Simulate a password reset request
        setTimeout(() => {
            toast({
                title: "Reset Link Sent",
                description: "Please check your email for the password reset link.",
            });
            setIsLoading(false);
            navigate('/login'); // Redirect to login after reset
        }, 2000);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className='flex flex-col gap-2'>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword ? "Hide password" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword ? "Hide password" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
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
            </motion.div>
        </div>
    );
};

export default ResetPassword;
