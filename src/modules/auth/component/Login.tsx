import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login request
    setTimeout(() => {
      setIsLoading(false);

      // This is just a mock for demonstration
      if (email === 'demo@example.com' && password === 'password') {
        toast({
          title: 'Login successful',
          description: 'Welcome back to your event organizer dashboard',
        });
        // In a real app, you would navigate to the dashboard and set auth state
        window.location.href = '/';
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-primary bg-login-background bg-cover p-4'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md space-y-6'
      >
        {/* Logo Container */}
        <div className='w-full flex justify-center mb-6'>
          <img src='/logo/sm_logo.png' alt='Showmates Logo' className='h-12' />{' '}
          {/* Adjust height as needed */}
        </div>
        <Card className='shadow-xl'>
          <CardHeader className='space-y-1 text-center'>
            <CardTitle className='text-2xl font-bold'>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your organizer dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='Email address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='pl-10'
                    required
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='pl-10 pr-10'
                    required
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3'
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                    <span className='sr-only'>
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='remember'
                    className=' text-primary-500 border-gray-300 rounded shadow-sm focus:border-primary accent-[#4f46e5]'
                  />
                  <label
                    htmlFor='remember'
                    className='text-sm font-medium text-gray-700'
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to='/forgot-password'
                  className='text-sm font-medium text-primary'
                >
                  Forgot password?
                </Link>
              </div>
              <Button className='w-full' type='submit' disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className='text-center text-sm'>
            <div className='mx-auto'>
              Don't have an account?{' '}
              <Link to='/signup' className='font-medium text-primary'>
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className='text-center mt-6 text-sm text-gray-500'>
          <p>Demo credentials: demo@example.com / password</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
