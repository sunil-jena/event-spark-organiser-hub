import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Settings</h1>
        <p className='text-gray-500 mt-1'>
          Manage your application preferences
        </p>
      </div>

      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-1 block' htmlFor='email'>
                Email Address
              </label>
              <input
                id='email'
                type='email'
                className='w-full px-3 py-2 border rounded-md'
                defaultValue='john.doe@example.com'
              />
            </div>
            <div>
              <label
                className='text-sm font-medium mb-1 block'
                htmlFor='password'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                className='w-full px-3 py-2 border rounded-md'
                placeholder='••••••••'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Leave blank to keep your current password
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                id='twoFactor'
                type='checkbox'
                className='rounded border-gray-300'
              />
              <label htmlFor='twoFactor' className='text-sm'>
                Enable two-factor authentication
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className='bg-primary hover:bg-primary/90'
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-medium'>Email Notifications</h4>
                <p className='text-xs text-gray-500'>
                  Receive email updates about your events
                </p>
              </div>
              <div className='relative inline-block w-10 align-middle select-none'>
                <input
                  type='checkbox'
                  id='emailNotif'
                  className='sr-only'
                  defaultChecked
                />
                <label
                  htmlFor='emailNotif'
                  className='block h-6 overflow-hidden rounded-full bg-gray-200 cursor-pointer'
                >
                  <span className='block h-6 w-6 rounded-full bg-white border border-gray-200 transform transition-transform duration-200 ease-in-out'></span>
                </label>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-medium'>SMS Notifications</h4>
                <p className='text-xs text-gray-500'>
                  Get text message alerts for important updates
                </p>
              </div>
              <div className='relative inline-block w-10 align-middle select-none'>
                <input type='checkbox' id='smsNotif' className='sr-only' />
                <label
                  htmlFor='smsNotif'
                  className='block h-6 overflow-hidden rounded-full bg-gray-200 cursor-pointer'
                >
                  <span className='block h-6 w-6 rounded-full bg-white border border-gray-200 transform transition-transform duration-200 ease-in-out'></span>
                </label>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-medium'>Push Notifications</h4>
                <p className='text-xs text-gray-500'>
                  Receive push notifications on your mobile device
                </p>
              </div>
              <div className='relative inline-block w-10 align-middle select-none'>
                <input
                  type='checkbox'
                  id='pushNotif'
                  className='sr-only'
                  defaultChecked
                />
                <label
                  htmlFor='pushNotif'
                  className='block h-6 overflow-hidden rounded-full bg-gray-200 cursor-pointer'
                >
                  <span className='block h-6 w-6 rounded-full bg-white border border-gray-200 transform transition-transform duration-200 ease-in-out'></span>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className='bg-primary hover:bg-primary/90'
              onClick={handleSave}
            >
              Save Preferences
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>
              Configure your payment preferences
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-1 block'>
                Default Currency
              </label>
              <select className='w-full px-3 py-2 border rounded-md'>
                <option value='USD'>US Dollar (USD)</option>
                <option value='EUR'>Euro (EUR)</option>
                <option value='GBP'>British Pound (GBP)</option>
                <option value='CAD'>Canadian Dollar (CAD)</option>
                <option value='AUD'>Australian Dollar (AUD)</option>
              </select>
            </div>
            <div>
              <label className='text-sm font-medium mb-1 block'>
                Payout Schedule
              </label>
              <select className='w-full px-3 py-2 border rounded-md'>
                <option value='immediate'>Immediate (after event)</option>
                <option value='weekly'>Weekly</option>
                <option value='biweekly'>Bi-weekly</option>
                <option value='monthly'>Monthly</option>
              </select>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                id='automaticPayout'
                type='checkbox'
                className='rounded border-gray-300'
                defaultChecked
              />
              <label htmlFor='automaticPayout' className='text-sm'>
                Enable automatic payouts
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className='bg-primary hover:bg-primary/90'
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
