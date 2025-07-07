
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Trash2, MapPin, Map, Search } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  latitude?: number;
  longitude?: number;
  tbd?: boolean; // To be determined flag
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
    capacity: undefined,
    tbd: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addMethod, setAddMethod] = useState<'manual' | 'map'>('manual');
  const [mapApiKey, setMapApiKey] = useState<string>('');
  const [showMapKeyInput, setShowMapKeyInput] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const validateVenue = (venue: VenueFormValues) => {
    const newErrors: Record<string, string> = {};
    
    // If venue is TBD, only city is required
    if (venue.tbd) {
      if (!venue.city) newErrors.city = 'City is required even for TBD venues';
      return newErrors;
    }
    
    // Normal validation for complete venues
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
        capacity: undefined,
        tbd: false
      });
      setErrors({});
      
      toast({
        title: "Venue added",
        description: `${newVenue.name || 'Venue'} has been added to your event venues.`
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

  const toggleTBD = (checked: boolean) => {
    setNewVenue({
      ...newVenue,
      tbd: checked,
      // Clear out venue-specific fields if TBD is checked
      name: checked ? 'TBD' : newVenue.name,
      address: checked ? '' : newVenue.address,
      state: checked ? '' : newVenue.state,
      zipCode: checked ? '' : newVenue.zipCode,
    });
  };

  // Initialize map if API key is provided
  useEffect(() => {
    if (addMethod === 'map' && mapApiKey && mapRef.current && !mapLoaded) {
      // This would be where we'd initialize Google Maps
      // For this implementation, we're just simulating the map loading
      setMapLoaded(true);
      
      // Simulated map loading code - in a real implementation, 
      // this would be replaced with actual Google Maps initialization
      const simulateMapLoad = () => {
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
              <Map class="h-12 w-12 text-gray-400 mb-2" />
              <p class="text-gray-500">Map would load here with API key</p>
              <p class="text-xs text-gray-400 mt-1">This is a placeholder for Google Maps integration</p>
            </div>
          `;
        }
      };
      
      setTimeout(simulateMapLoad, 500);
    }
  }, [addMethod, mapApiKey, mapLoaded]);

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Venues</h2>
        
        <Tabs defaultValue="manual" onValueChange={(value) => setAddMethod(value as 'manual' | 'map')}>
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Add Manually</TabsTrigger>
            <TabsTrigger value="map">Select from Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Add New Venue
            </h3>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="venueTBD"
                  checked={newVenue.tbd}
                  onChange={(e) => toggleTBD(e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <Label htmlFor="venueTBD">Venue to be determined (TBD)</Label>
              </div>
              <div className="ml-2 text-xs text-gray-500">
                {newVenue.tbd && "(Only city selection is required)"}
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {!newVenue.tbd && (
                <>
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
                </>
              )}
              
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
              
              {!newVenue.tbd && (
                <>
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
                </>
              )}
            </div>
            
            <Button
              onClick={handleAddVenue}
              className="mt-4 flex items-center"
              variant="secondary"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Venue
            </Button>
          </TabsContent>
          
          <TabsContent value="map" className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center">
              <Map className="h-4 w-4 mr-2" />
              Select Venue from Map
            </h3>
            
            {!mapApiKey && (
              <div className="mb-4">
                {showMapKeyInput ? (
                  <div className="space-y-2">
                    <Label htmlFor="mapApiKey">Google Maps API Key</Label>
                    <Input
                      id="mapApiKey"
                      type="text" 
                      value={mapApiKey}
                      onChange={(e) => setMapApiKey(e.target.value)}
                      placeholder="Enter your Google Maps API key"
                    />
                    <p className="text-xs text-gray-500">
                      You can get a key from the <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Maps Platform</a>.
                    </p>
                    <Button 
                      onClick={() => setShowMapKeyInput(false)}
                      variant="outline" 
                      size="sm"
                    >
                      Apply
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setShowMapKeyInput(true)}
                    variant="outline"
                    className="mb-4"
                  >
                    Enter Google Maps API Key
                  </Button>
                )}
              </div>
            )}
            
            <div className="mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for a venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary" className="flex items-center">
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </div>
            
            <div 
              ref={mapRef} 
              className="h-80 border border-gray-300 rounded-md mb-4 bg-gray-100 flex items-center justify-center"
            >
              {!mapApiKey ? (
                <div className="text-center p-4">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Enter your Google Maps API key to enable map selection</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Loading map...</p>
                </div>
              )}
            </div>
            
            {mapApiKey && (
              <div className="space-y-4">
                <h4 className="font-medium">Selected Venue</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mapVenueName">Venue Name</Label>
                    <Input
                      id="mapVenueName"
                      value={newVenue.name}
                      onChange={(e) => setNewVenue({...newVenue, name: e.target.value})}
                      placeholder="Enter venue name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mapVenueCapacity">Capacity (optional)</Label>
                    <Input
                      id="mapVenueCapacity"
                      type="number"
                      value={newVenue.capacity || ''}
                      onChange={(e) => setNewVenue({...newVenue, capacity: e.target.value ? parseInt(e.target.value) : undefined})}
                      placeholder="Enter maximum capacity"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleAddVenue}
                  className="flex items-center"
                  variant="secondary"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Selected Venue
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {venueList.length > 0 && (
          <div className="mb-6 mt-6">
            <h3 className="font-medium mb-3">Added Venues</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {venueList.map((venue) => (
                <div key={venue.id} className="border rounded-lg p-3 bg-white flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{venue.tbd ? `TBD Venue in ${venue.city}` : venue.name}</h4>
                    {!venue.tbd && (
                      <p className="text-sm text-gray-600">{venue.address}, {venue.city}, {venue.state} {venue.zipCode}</p>
                    )}
                    {venue.tbd && (
                      <p className="text-sm text-gray-600">Location will be determined later</p>
                    )}
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
