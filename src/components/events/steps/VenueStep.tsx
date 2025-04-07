
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Trash2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';

export interface VenueFormValues {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  capacity?: number;
}

interface VenueStepProps {
  venues: VenueFormValues[];
  onSubmit: (venues: VenueFormValues[]) => void;
  onBack: () => void;
}

// List of sample cities
const CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", 
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "San Francisco",
  "Charlotte", "Indianapolis", "Seattle", "Denver", "Washington"
];

export const VenueStep: React.FC<VenueStepProps> = ({ venues, onSubmit, onBack }) => {
  const [venueList, setVenueList] = useState<VenueFormValues[]>(venues);
  const [newVenue, setNewVenue] = useState<VenueFormValues>({
    id: uuidv4(),
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    capacity: undefined
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateVenue = (venue: VenueFormValues) => {
    const newErrors: Record<string, string> = {};
    
    if (!venue.name) newErrors.name = 'Venue name is required';
    if (!venue.address) newErrors.address = 'Address is required';
    if (!venue.city) newErrors.city = 'City is required';
    if (!venue.state) newErrors.state = 'State is required';
    if (!venue.zipCode) newErrors.zipCode = 'Zip code is required';
    
    if (venue.capacity !== undefined && venue.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    return newErrors;
  };

  const handleAddVenue = () => {
    const validationErrors = validateVenue(newVenue);
    
    if (Object.keys(validationErrors).length === 0) {
      setVenueList([...venueList, newVenue]);
      setNewVenue({
        id: uuidv4(),
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        capacity: undefined
      });
      setErrors({});
      
      toast({
        title: "Venue added",
        description: `${newVenue.name} has been added to your event venues.`
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const handleRemoveVenue = (id: string) => {
    setVenueList(venueList.filter(venue => venue.id !== id));
    
    toast({
      title: "Venue removed",
      description: "The venue has been removed from your event."
    });
  };

  const handleSubmit = () => {
    if (venueList.length === 0) {
      toast({
        title: "No venues added",
        description: "Please add at least one venue for your event.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(venueList);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Venues</h2>
        
        <div className="mb-6 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Add New Venue
          </h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                value={newVenue.name}
                onChange={(e) => setNewVenue({...newVenue, name: e.target.value})}
                placeholder="Enter venue name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venueCapacity">Capacity (optional)</Label>
              <Input
                id="venueCapacity"
                type="number"
                value={newVenue.capacity || ''}
                onChange={(e) => setNewVenue({...newVenue, capacity: e.target.value ? parseInt(e.target.value) : undefined})}
                placeholder="Enter maximum capacity"
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venueAddress">Address</Label>
              <Input
                id="venueAddress"
                value={newVenue.address}
                onChange={(e) => setNewVenue({...newVenue, address: e.target.value})}
                placeholder="Enter street address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venueCity">City</Label>
              <Select
                value={newVenue.city}
                onValueChange={(value) => setNewVenue({...newVenue, city: value})}
              >
                <SelectTrigger id="venueCity" className={errors.city ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venueState">State</Label>
              <Input
                id="venueState"
                value={newVenue.state}
                onChange={(e) => setNewVenue({...newVenue, state: e.target.value})}
                placeholder="Enter state"
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venueZip">Zip Code</Label>
              <Input
                id="venueZip"
                value={newVenue.zipCode}
                onChange={(e) => setNewVenue({...newVenue, zipCode: e.target.value})}
                placeholder="Enter zip code"
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
            </div>
          </div>
          
          <Button
            onClick={handleAddVenue}
            className="mt-4 flex items-center"
            variant="secondary"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Venue
          </Button>
        </div>
        
        {venueList.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3">Added Venues</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {venueList.map((venue) => (
                <div key={venue.id} className="border rounded-lg p-3 bg-white flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{venue.name}</h4>
                    <p className="text-sm text-gray-600">{venue.address}, {venue.city}, {venue.state} {venue.zipCode}</p>
                    {venue.capacity && <p className="text-xs text-gray-500">Capacity: {venue.capacity}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveVenue(venue.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            className="flex items-center"
          >
            Next: Dates <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
