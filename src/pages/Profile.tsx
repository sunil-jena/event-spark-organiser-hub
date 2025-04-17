import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ModalForm } from '@/components/ui/modal-form';
import {
  Camera,
  Upload,
  User,
  Briefcase,
  IndianRupee,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orgName: string;
  website: string;
  description: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  taxId: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: 'Rohit',
    lastName: 'Sharma',
    email: 'rohit.sharma@example.com',
    phone: '+91 98765 43210',
    orgName: 'EventSpark Productions',
    website: 'https://eventspark.example.com',
    description:
      'We organize innovative events that connect people and create memorable experiences.',
    accountHolder: 'Rohit Sharma',
    bankName: 'State Bank of India',
    accountNumber: 'XXXX-XXXX-XXXX-1234',
    taxId: 'ABCTY1234D',
    address: '123 Event Street, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500033',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (section: string) => {
    toast({
      title: `${section} Updated`,
      description: `Your ${section.toLowerCase()} information has been saved.`,
    });
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Organizer Profile</h1>
        <p className='text-gray-500 mt-1'>
          Manage your organizer information and settings
        </p>
      </div>

      {/* Avatar Section */}
      <Card className='mb-6'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Your profile image that will be visible to customers
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='flex items-center gap-6'>
          <Avatar className='h-24 w-24 border-2 border-muted'>
            <AvatarImage src='https://i.pravatar.cc/150?img=13' />
            <AvatarFallback>
              <User className='h-12 w-12' />
            </AvatarFallback>
          </Avatar>
          <div>
            <Button
              variant='outline'
              size='sm'
              className='mb-2'
              onClick={() => setAvatarModalOpen(true)}
            >
              <Camera className='mr-2 h-4 w-4' />
              Change Picture
            </Button>
            <p className='text-sm text-muted-foreground'>
              Recommended: Square JPG, PNG or GIF, at least 300x300 pixels.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className='space-y-6'>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <User className='mr-2 h-5 w-5' />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <Label
                  className='text-sm font-medium mb-1 block'
                  htmlFor='firstName'
                >
                  First Name
                </Label>
                <Input
                  id='firstName'
                  name='firstName'
                  type='text'
                  className='w-full'
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex-1'>
                <Label
                  className='text-sm font-medium mb-1 block'
                  htmlFor='lastName'
                >
                  Last Name
                </Label>
                <Input
                  id='lastName'
                  name='lastName'
                  type='text'
                  className='w-full'
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label className='text-sm font-medium mb-1 block' htmlFor='email'>
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  className='w-full pl-10'
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label className='text-sm font-medium mb-1 block' htmlFor='phone'>
                Phone Number
              </Label>
              <div className='relative'>
                <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  id='phone'
                  name='phone'
                  type='tel'
                  className='w-full pl-10'
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className='bg-primary hover:bg-primary/90'
              onClick={() => handleSave('Personal Information')}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Briefcase className='mr-2 h-5 w-5' />
              Organization Details
            </CardTitle>
            <CardDescription>
              Information about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label
                className='text-sm font-medium mb-1 block'
                htmlFor='orgName'
              >
                Organization Name
              </Label>
              <Input
                id='orgName'
                name='orgName'
                type='text'
                className='w-full'
                value={formData.orgName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label
                className='text-sm font-medium mb-1 block'
                htmlFor='website'
              >
                Website
              </Label>
              <Input
                id='website'
                name='website'
                type='url'
                className='w-full'
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label
                className='text-sm font-medium mb-1 block'
                htmlFor='description'
              >
                Description
              </Label>
              <Textarea
                id='description'
                name='description'
                className='w-full h-24 resize-none'
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className='bg-primary hover:bg-primary/90'
              onClick={() => handleSave('Organization Details')}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <MapPin className='mr-2 h-5 w-5' />
              Address Information
            </CardTitle>
            <CardDescription>Your business address details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label
                className='text-sm font-medium mb-1 block'
                htmlFor='address'
              >
                Street Address
              </Label>
              <Input
                id='address'
                name='address'
                type='text'
                className='w-full'
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <Label
                  className='text-sm font-medium mb-1 block'
                  htmlFor='city'
                >
                  City
                </Label>
                <Input
                  id='city'
                  name='city'
                  type='text'
                  className='w-full'
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label
                  className='text-sm font-medium mb-1 block'
                  htmlFor='state'
                >
                  State
                </Label>
                <Input
                  id='state'
                  name='state'
                  type='text'
                  className='w-full'
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label
                  className='text-sm font-medium mb-1 block'
                  htmlFor='postalCode'
                >
                  Postal Code
                </Label>
                <Input
                  id='postalCode'
                  name='postalCode'
                  type='text'
                  className='w-full'
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className='bg-primary hover:bg-primary/90'
              onClick={() => handleSave('Address Information')}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <IndianRupee className='mr-2 h-5 w-5' />
              Billing Information
            </CardTitle>
            <CardDescription>
              Your payment information for payouts
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label
                className='text-sm font-medium mb-1 block'
                htmlFor='accountHolder'
              >
                Account Holder Name
              </Label>
              <Input
                id='accountHolder'
                name='accountHolder'
                type='text'
                className='w-full'
                value={formData.accountHolder}
                onChange={handleInputChange}
              />
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1'>
                <Label
                  className='text-sm font-medium mb-1 block'
                  htmlFor='bankName'
                >
                  Bank Name
                </Label>
                <Input
                  id='bankName'
                  name='bankName'
                  type='text'
                  className='w-full'
                  value={formData.bankName}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex-1'>
                <Label
                  className='text-sm font-medium mb-1 block'
                  htmlFor='accountNumber'
                >
                  Account Number
                </Label>
                <Input
                  id='accountNumber'
                  name='accountNumber'
                  type='text'
                  className='w-full'
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label className='text-sm font-medium mb-1 block' htmlFor='taxId'>
                GST/PAN Number
              </Label>
              <Input
                id='taxId'
                name='taxId'
                type='text'
                className='w-full'
                value={formData.taxId}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className='bg-primary hover:bg-primary/90'
              onClick={() => handleSave('Billing Information')}
            >
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Avatar Upload Modal */}
      <ModalForm
        title='Update Profile Picture'
        description='Upload a new profile picture'
        open={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        submitLabel='Save Image'
        size='sm'
      >
        <div className='space-y-4'>
          <div className='flex justify-center mb-4'>
            <Avatar className='h-32 w-32 border-2 border-muted'>
              <AvatarImage src='https://i.pravatar.cc/150?img=13' />
              <AvatarFallback>
                <User className='h-16 w-16' />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className='border-2 border-dashed border-gray-200 rounded-lg p-6 text-center'>
            <Upload className='h-8 w-8 mx-auto text-gray-400 mb-2' />
            <p className='text-sm font-medium'>Drag & drop your image here</p>
            <p className='text-xs text-gray-500 mt-1'>
              PNG, JPG or GIF up to 5MB
            </p>
            <Button variant='outline' size='sm' className='mt-4'>
              Choose File
            </Button>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default Profile;
