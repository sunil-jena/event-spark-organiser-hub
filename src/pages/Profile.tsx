
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Organizer Profile</h1>
        <p className="text-gray-500 mt-1">Manage your organizer information and settings</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block" htmlFor="firstName">First Name</label>
                <input 
                  id="firstName"
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue="John"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block" htmlFor="lastName">Last Name</label>
                <input 
                  id="lastName"
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue="Doe"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="john.doe@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="phone">Phone Number</label>
              <input 
                id="phone"
                type="tel" 
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="+1 (555) 123-4567"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Information about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="orgName">Organization Name</label>
              <input 
                id="orgName"
                type="text" 
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="EventSpark Productions"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="website">Website</label>
              <input 
                id="website"
                type="url" 
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="https://eventspark.example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="description">Description</label>
              <textarea 
                id="description"
                className="w-full px-3 py-2 border rounded-md h-24 resize-none"
                defaultValue="We organize innovative events that connect people and create memorable experiences."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Your payment information for payouts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="accountHolder">Account Holder Name</label>
              <input 
                id="accountHolder"
                type="text" 
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="John Doe"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block" htmlFor="bankName">Bank Name</label>
                <input 
                  id="bankName"
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue="National Bank"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block" htmlFor="accountNumber">Account Number</label>
                <input 
                  id="accountNumber"
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue="XXXX-XXXX-XXXX-1234"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" htmlFor="taxId">Tax ID / VAT Number</label>
              <input 
                id="taxId"
                type="text" 
                className="w-full px-3 py-2 border rounded-md"
                defaultValue="123-45-6789"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
