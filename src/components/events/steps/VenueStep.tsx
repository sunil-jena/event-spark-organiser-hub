
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Trash2, MapPin, Map, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'bengaluru', label: 'Bengaluru' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'kolkata', label: 'Kolkata' },
  { value: 'ahmedabad', label: 'Ahmedabad' },
  { value: 'pune', label: 'Pune' },
  { value: 'surat', label: 'Surat' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'lucknow', label: 'Lucknow' },
  { value: 'kanpur', label: 'Kanpur' },
  { value: 'nagpur', label: 'Nagpur' },
  { value: 'indore', label: 'Indore' },
  { value: 'thane', label: 'Thane' },
  { value: 'bhopal', label: 'Bhopal' },
  { value: 'visakhapatnam', label: 'Visakhapatnam' },
  { value: 'pimpri-chinchwad', label: 'Pimpri-Chinchwad' },
  { value: 'patna', label: 'Patna' },
  { value: 'vadodara', label: 'Vadodara' },
  { value: 'ghaziabad', label: 'Ghaziabad' },
  { value: 'ludhiana', label: 'Ludhiana' },
  { value: 'agra', label: 'Agra' },
  { value: 'nashik', label: 'Nashik' },
  { value: 'faridabad', label: 'Faridabad' },
  { value: 'meerut', label: 'Meerut' },
  { value: 'rajkot', label: 'Rajkot' },
  { value: 'kalyan-dombivli', label: 'Kalyan-Dombivli' },
  { value: 'vasai-virar', label: 'Vasai-Virar' },
  { value: 'varanasi', label: 'Varanasi' },
  { value: 'srinagar', label: 'Srinagar' },
  { value: 'aurangabad', label: 'Aurangabad' },
  { value: 'dhanbad', label: 'Dhanbad' },
  { value: 'amritsar', label: 'Amritsar' },
  { value: 'navi-mumbai', label: 'Navi Mumbai' },
  { value: 'allahabad', label: 'Allahabad' },
  { value: 'ranchi', label: 'Ranchi' },
  { value: 'howrah', label: 'Howrah' },
  { value: 'coimbatore', label: 'Coimbatore' },
  { value: 'jabalpur', label: 'Jabalpur' },
  { value: 'gwalior', label: 'Gwalior' },
  { value: 'vijayawada', label: 'Vijayawada' },
  { value: 'jodhpur', label: 'Jodhpur' },
  { value: 'madurai', label: 'Madurai' },
  { value: 'raipur', label: 'Raipur' },
  { value: 'kota', label: 'Kota' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'guwahati', label: 'Guwahati' },
  { value: 'solapur', label: 'Solapur' },
  { value: 'hubli-dharwad', label: 'Hubli-Dharwad' },
  { value: 'mysore', label: 'Mysore' },
  { value: 'tiruchirappalli', label: 'Tiruchirappalli' },
  { value: 'bareilly', label: 'Bareilly' },
  { value: 'aligarh', label: 'Aligarh' },
  { value: 'tiruppur', label: 'Tiruppur' },
  { value: 'gurgaon', label: 'Gurgaon' },
  { value: 'moradabad', label: 'Moradabad' },
  { value: 'jalandhar', label: 'Jalandhar' },
  { value: 'bhubaneswar', label: 'Bhubaneswar' },
  { value: 'salem', label: 'Salem' },
  { value: 'warangal', label: 'Warangal' },
  { value: 'jamshedpur', label: 'Jamshedpur' },
  { value: 'mangalore', label: 'Mangalore' },
  { value: 'thiruvananthapuram', label: 'Thiruvananthapuram' },
  { value: 'guntur', label: 'Guntur' }
];

// Validation schema for a single venue
const venueSchema = Yup.object().shape({
  name: Yup.string().when('tbd', {
    is: false,
    then: (schema) => schema.required('Venue name is required'),
    otherwise: (schema) => schema,
  }),
  address: Yup.string().when('tbd', {
    is: false,
    then: (schema) => schema.required('Address is required'),
    otherwise: (schema) => schema,
  }),
  city: Yup.string().required('City is required'),
  state: Yup.string().when('tbd', {
    is: false,
    then: (schema) => schema.required('State is required'),
    otherwise: (schema) => schema,
  }),
  zipCode: Yup.string().when('tbd', {
    is: false,
    then: (schema) => schema.required('Zip code is required'),
    otherwise: (schema) => schema,
  }),
  country: Yup.string().required('Country is required'),
  capacity: Yup.number().min(1, 'Capacity must be greater than 0').nullable(),
  tbd: Yup.boolean(),
});

export const VenueStep: React.FC<VenueStepProps> = ({ venues, onSubmit, onBack }) => {
  const [venueList, setVenueList] = useState<VenueFormValues[]>(venues);
  const [cityOpen, setCityOpen] = useState<boolean>(false);
  const [addMethod, setAddMethod] = useState<'manual' | 'map'>('manual');
  const [mapApiKey, setMapApiKey] = useState<string>('');
  const [showMapKeyInput, setShowMapKeyInput] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();

  // Formik for new venue form
  const venueFormik = useFormik({
    initialValues: {
      id: uuidv4(),
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      capacity: undefined as number | undefined,
      tbd: false
    },
    validationSchema: venueSchema,
    onSubmit: (values, { resetForm }) => {
      setVenueList(prev => [...prev, { ...values, id: uuidv4() }]);
      toast({
        title: "Venue added",
        description: `${values.name || 'Venue'} has been added to your event venues.`
      });
      resetForm();
    },
  });

  // Effect to handle TBD changes
  useEffect(() => {
    if (venueFormik.values.tbd) {
      venueFormik.setFieldValue('name', 'TBD');
      venueFormik.setFieldValue('address', '');
      venueFormik.setFieldValue('state', '');
      venueFormik.setFieldValue('zipCode', '');
    }
  }, [venueFormik.values.tbd]);

  // Handle venue removal
  const handleRemoveVenue = (id: string) => {
    setVenueList(venueList.filter(venue => venue.id !== id));
    toast({
      title: "Venue removed",
      description: "The venue has been removed from your event."
    });
  };

  // Handle final submission
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
              <div class="h-12 w-12 text-gray-400 mb-2"></div>
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

            <form onSubmit={venueFormik.handleSubmit}>
              <div className="flex items-center mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="venueTBD"
                    checked={venueFormik.values.tbd}
                    onChange={venueFormik.handleChange}
                    onBlur={venueFormik.handleBlur}
                    name="tbd"
                    className="h-4 w-4 rounded"
                  />
                  <Label htmlFor="venueTBD">Venue to be determined (TBD)</Label>
                </div>
                <div className="ml-2 text-xs text-gray-500">
                  {venueFormik.values.tbd && "(Only city selection is required)"}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {!venueFormik.values.tbd && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Venue Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={venueFormik.values.name}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter venue name"
                        className={venueFormik.errors.name && venueFormik.touched.name ? "border-red-500" : ""}
                      />
                      {venueFormik.errors.name && venueFormik.touched.name &&
                        <p className="text-red-500 text-sm">{venueFormik.errors.name}</p>
                      }
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity (optional)</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        value={venueFormik.values.capacity || ''}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter maximum capacity"
                        className={venueFormik.errors.capacity && venueFormik.touched.capacity ? "border-red-500" : ""}
                      />
                      {venueFormik.errors.capacity && venueFormik.touched.capacity &&
                        <p className="text-red-500 text-sm">{venueFormik.errors.capacity}</p>
                      }
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityOpen}
                        className={`w-full justify-between ${venueFormik.errors.city && venueFormik.touched.city ? "border-red-500" : ""
                          }`}
                      >
                        {venueFormik.values.city
                          ? CITIES.find((city) => city.value === venueFormik.values.city)?.label || venueFormik.values.city
                          : "Select city"}
                        <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          {CITIES.map((city) => (
                            <CommandItem
                              key={city.value}
                              value={city.value}
                              onSelect={(currentValue) => {
                                venueFormik.setFieldValue('city', currentValue);
                                setCityOpen(false);
                              }}
                            >
                              <span>{city.label}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {venueFormik.errors.city && venueFormik.touched.city &&
                    <p className="text-red-500 text-sm">{venueFormik.errors.city}</p>
                  }
                </div>

                {!venueFormik.values.tbd && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={venueFormik.values.address}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter street address"
                        className={venueFormik.errors.address && venueFormik.touched.address ? "border-red-500" : ""}
                      />
                      {venueFormik.errors.address && venueFormik.touched.address &&
                        <p className="text-red-500 text-sm">{venueFormik.errors.address}</p>
                      }
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={venueFormik.values.state}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter state"
                        className={venueFormik.errors.state && venueFormik.touched.state ? "border-red-500" : ""}
                      />
                      {venueFormik.errors.state && venueFormik.touched.state &&
                        <p className="text-red-500 text-sm">{venueFormik.errors.state}</p>
                      }
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={venueFormik.values.zipCode}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter zip code"
                        className={venueFormik.errors.zipCode && venueFormik.touched.zipCode ? "border-red-500" : ""}
                      />
                      {venueFormik.errors.zipCode && venueFormik.touched.zipCode &&
                        <p className="text-red-500 text-sm">{venueFormik.errors.zipCode}</p>
                      }
                    </div>
                  </>
                )}
              </div>

              <Button
                type="submit"
                className="mt-4 flex items-center"
                variant="secondary"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Venue
              </Button>
            </form>
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
              ) : !mapLoaded ? (
                <div className="flex flex-col items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Loading map...</p>
                </div>
              ) : null}
            </div>

            {mapApiKey && mapLoaded && (
              <form onSubmit={venueFormik.handleSubmit}>
                <div className="space-y-4">
                  <h4 className="font-medium">Selected Venue</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Venue Name</Label>
                      <Input
                        id="mapVenueName"
                        name="name"
                        value={venueFormik.values.name}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter venue name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity (optional)</Label>
                      <Input
                        id="mapVenueCapacity"
                        name="capacity"
                        type="number"
                        value={venueFormik.values.capacity || ''}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter maximum capacity"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="flex items-center"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Selected Venue
                  </Button>
                </div>
              </form>
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

export default VenueStep;
