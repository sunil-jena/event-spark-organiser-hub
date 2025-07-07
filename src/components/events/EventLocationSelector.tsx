import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from '@/components/ui/dialog';
import { EventLocation } from './CreateEventForm';
import { MapPin, Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface EventLocationSelectorProps {
  value: EventLocation[];
  onChange: (locations: EventLocation[]) => void;
}

// Sample popular venues for suggestion
const POPULAR_VENUES = [
  {
    name: 'Grand Hall',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    latitude: 40.7128,
    longitude: -74.0060,
    capacity: 500,
  },
  {
    name: 'City Convention Center',
    address: '456 Broadway',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    latitude: 34.0522,
    longitude: -118.2437,
    capacity: 1200,
  },
  {
    name: 'Riverside Theater',
    address: '789 Park Ave',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60007',
    country: 'USA',
    latitude: 41.8781,
    longitude: -87.6298,
    capacity: 350,
  },
];

const initialLocationState: EventLocation = {
  id: '',
  name: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
  capacity: 0,
};

export const EventLocationSelector: React.FC<EventLocationSelectorProps> = ({ value, onChange }) => {
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<EventLocation | null>(null);
  const [newLocation, setNewLocation] = useState<EventLocation>({ ...initialLocationState, id: uuidv4() });
  const [showPopularVenues, setShowPopularVenues] = useState(false);

  // Handlers
  const addLocation = () => {
    // Validate location
    if (!newLocation.name || !newLocation.address || !newLocation.city || !newLocation.state) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required location fields",
        variant: "destructive",
      });
      return;
    }

    onChange([...value, newLocation]);
    setNewLocation({ ...initialLocationState, id: uuidv4() });
    setIsAddingLocation(false);
  };

  const updateLocation = () => {
    if (!editingLocation) return;
    
    // Validate location
    if (!editingLocation.name || !editingLocation.address || !editingLocation.city || !editingLocation.state) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required location fields",
        variant: "destructive",
      });
      return;
    }

    const updatedLocations = value.map(loc => 
      loc.id === editingLocation.id ? editingLocation : loc
    );
    onChange(updatedLocations);
    setEditingLocation(null);
  };

  const removeLocation = (id: string) => {
    onChange(value.filter(loc => loc.id !== id));
  };

  const selectPopularVenue = (venue: Omit<EventLocation, 'id'>) => {
    setNewLocation({
      ...venue,
      id: uuidv4()
    });
    setShowPopularVenues(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Add Locations</h3>
        <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
          <DialogTrigger asChild>
            <Button type="button" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Event Location</DialogTitle>
              <DialogDescription>
                Enter the details of the venue or location for your event.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPopularVenues(!showPopularVenues)}
                >
                  {showPopularVenues ? 'Hide' : 'Show'} Popular Venues
                </Button>
              </div>
              
              {showPopularVenues && (
                <div className="border rounded-md p-3 mt-2">
                  <h4 className="font-medium mb-2">Popular Venues</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {POPULAR_VENUES.map((venue, idx) => (
                      <Button
                        key={idx}
                        type="button"
                        variant="outline"
                        className="justify-start h-auto py-2"
                        onClick={() => selectPopularVenue(venue)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{venue.name}</div>
                          <div className="text-xs text-gray-500">
                            {venue.address}, {venue.city}, {venue.state}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venueName">Venue Name *</Label>
                  <Input
                    id="venueName"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    placeholder="Enter venue name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newLocation.capacity || ''}
                    onChange={(e) => setNewLocation({ ...newLocation, capacity: parseInt(e.target.value) || 0 })}
                    placeholder="Enter venue capacity"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  placeholder="Enter street address"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={newLocation.city}
                    onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                    placeholder="Enter city"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={newLocation.state}
                    onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={newLocation.zipCode}
                    onChange={(e) => setNewLocation({ ...newLocation, zipCode: e.target.value })}
                    placeholder="Enter ZIP code"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={newLocation.country}
                    onValueChange={(value) => setNewLocation({ ...newLocation, country: value })}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="CAN">Canada</SelectItem>
                      <SelectItem value="GBR">United Kingdom</SelectItem>
                      <SelectItem value="AUS">Australia</SelectItem>
                      <SelectItem value="DEU">Germany</SelectItem>
                      <SelectItem value="FRA">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Google Map would be added here in a real implementation */}
              <div className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-48 bg-gray-50">
                <MapPin className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Google Maps integration would be added here</p>
                <p className="text-xs text-gray-400 mt-1">Allows users to select location on the map</p>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={addLocation}>Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Edit Location Dialog */}
      <Dialog open={!!editingLocation} onOpenChange={(open) => !open && setEditingLocation(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event Location</DialogTitle>
            <DialogDescription>
              Update the details of this venue or location.
            </DialogDescription>
          </DialogHeader>
          
          {editingLocation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editVenueName">Venue Name *</Label>
                  <Input
                    id="editVenueName"
                    value={editingLocation.name}
                    onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                    placeholder="Enter venue name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editCapacity">Capacity</Label>
                  <Input
                    id="editCapacity"
                    type="number"
                    value={editingLocation.capacity || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, capacity: parseInt(e.target.value) || 0 })}
                    placeholder="Enter venue capacity"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editAddress">Address *</Label>
                <Input
                  id="editAddress"
                  value={editingLocation.address}
                  onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
                  placeholder="Enter street address"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editCity">City *</Label>
                  <Input
                    id="editCity"
                    value={editingLocation.city}
                    onChange={(e) => setEditingLocation({ ...editingLocation, city: e.target.value })}
                    placeholder="Enter city"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editState">State *</Label>
                  <Input
                    id="editState"
                    value={editingLocation.state}
                    onChange={(e) => setEditingLocation({ ...editingLocation, state: e.target.value })}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editZipCode">ZIP Code</Label>
                  <Input
                    id="editZipCode"
                    value={editingLocation.zipCode}
                    onChange={(e) => setEditingLocation({ ...editingLocation, zipCode: e.target.value })}
                    placeholder="Enter ZIP code"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editCountry">Country</Label>
                  <Select
                    value={editingLocation.country}
                    onValueChange={(value) => setEditingLocation({ ...editingLocation, country: value })}
                  >
                    <SelectTrigger id="editCountry">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="CAN">Canada</SelectItem>
                      <SelectItem value="GBR">United Kingdom</SelectItem>
                      <SelectItem value="AUS">Australia</SelectItem>
                      <SelectItem value="DEU">Germany</SelectItem>
                      <SelectItem value="FRA">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={updateLocation}>Update Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Location List */}
      {value.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
          <MapPin className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">No locations added yet</p>
          <p className="text-sm text-gray-400 mt-1">Add at least one location for your event</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {value.map((location) => (
            <Card key={location.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{location.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{location.address}</p>
                  <p className="text-sm text-gray-500">
                    {location.city}, {location.state} {location.zipCode}
                  </p>
                  {location.capacity && (
                    <p className="text-sm text-gray-500 mt-1">
                      Capacity: {location.capacity} people
                    </p>
                  )}
                </div>
                <div className="flex border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 rounded-none h-10"
                    onClick={() => setEditingLocation(location)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <div className="border-r" />
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 rounded-none h-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeLocation(location.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
