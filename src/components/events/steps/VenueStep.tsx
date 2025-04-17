import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Trash2, MapPin, Map, Search, Edit, Edit2 } from 'lucide-react';
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
import { useLoadScript } from '@react-google-maps/api';
import { Checkbox } from '@/components/ui/checkbox';

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
  tba?: boolean; // To be determined flag
}

interface VenueStepProps {
  venues: VenueFormValues[];
  onSubmit: (venues: VenueFormValues[]) => void;
  onBack: () => void;
}

// Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyAQr_EW8L6NELIUATInZXac_Tyij4yhOOE";

const libraries: ("places")[] = ['places'];

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

// Extend the validation schema to require latitude and longitude in non‑TBA cases.
const venueSchema = Yup.object().shape({
  name: Yup.string().when('tba', {
    is: false,
    then: (schema) => schema.required('Venue name is required'),
    otherwise: (schema) => schema,
  }),
  address: Yup.string().when('tba', {
    is: false,
    then: (schema) => schema.required('Address is required'),
    otherwise: (schema) => schema,
  }),
  city: Yup.string().required('City is required'),
  state: Yup.string().when('tba', {
    is: false,
    then: (schema) => schema.required('State is required'),
    otherwise: (schema) => schema,
  }),
  zipCode: Yup.string().when('tba', {
    is: false,
    then: (schema) => schema.required('Zip code is required'),
    otherwise: (schema) => schema,
  }),
  country: Yup.string().required('Country is required'),
  capacity: Yup.number().min(1, 'Capacity must be greater than 0').nullable(),
  // Require latitude and longitude when TBA is false
  latitude: Yup.number().when('tba', {
    is: false,
    then: (schema) =>
      schema
        .typeError('Latitude must be a number')
        .required('Latitude is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  longitude: Yup.number().when('tba', {
    is: false,
    then: (schema) =>
      schema
        .typeError('Longitude must be a number')
        .required('Longitude is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  tba: Yup.boolean(),
});

export const VenueStep: React.FC<VenueStepProps> = ({ venues, onSubmit, onBack }) => {
  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [venueList, setVenueList] = useState<VenueFormValues[]>(venues);
  const [cityOpen, setCityOpen] = useState<boolean>(false);
  const [addMethod, setAddMethod] = useState<'manual' | 'map'>('manual');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();
  // To track whether a venue is being edited.
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);

  // Map related refs
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  // Formik for the venue form
  const venueFormik = useFormik({
    initialValues: {
      id: uuidv4(),
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      capacity: undefined as number | undefined,
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
      tba: false
    },
    validationSchema: venueSchema,
    onSubmit: (values, { resetForm }) => {
      if (editingVenueId) {
        // Update an existing venue.
        setVenueList(prev =>
          prev.map(venue =>
            venue.id === editingVenueId ? { ...values, id: editingVenueId } : venue
          )
        );
        toast({
          title: "Venue updated",
          description: `${values.name || 'Venue'} has been updated.`
        });
        setEditingVenueId(null);
      } else {
        // Add a new venue.
        setVenueList(prev => [...prev, { ...values, id: uuidv4() }]);
        toast({
          title: "Venue added",
          description: `${values.name || 'Venue'} has been added to your event venues.`
        });
      }
      resetForm();

      // Clear map markers if in map mode.
      if (addMethod === 'map') {
        clearMapMarkers();
      }
    },
  });

  // When TBA is checked, auto-clear some fields.
  useEffect(() => {
    if (venueFormik.values.tba) {
      venueFormik.setFieldValue('name', 'tba');
      venueFormik.setFieldValue('address', '');
      venueFormik.setFieldValue('state', '');
      venueFormik.setFieldValue('zipCode', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueFormik.values.tba]);

  // Remove a venue.
  const handleRemoveVenue = (id: string) => {
    setVenueList(venueList.filter(venue => venue.id !== id));
    toast({
      title: "Venue removed",
      description: "The venue has been removed from your event."
    });
    if (editingVenueId === id) {
      setEditingVenueId(null);
      venueFormik.resetForm();
    }
  };

  // Edit a venue: load its values into the form and switch to the manual tab.
  const handleEditVenue = (venue: VenueFormValues) => {
    setEditingVenueId(venue.id);
    venueFormik.setValues({
      id: venue.id,
      name: venue.name,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      zipCode: venue.zipCode,
      country: venue.country,
      capacity: venue.capacity,
      latitude: venue.latitude,
      longitude: venue.longitude,
      tba: venue.tba || false,
    });
    setAddMethod('manual');
  };

  // Final submission handler.
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

  // Clear all markers from the map.
  const clearMapMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
  };

  // Initialize Google Maps when the map tab is active.
  useEffect(() => {
    if (addMethod === 'map' && isLoaded && !loadError && mapRef.current && !googleMapRef.current) {
      const defaultCenter = { lat: 20.5937, lng: 78.9629 };
      const mapOptions: google.maps.MapOptions = {
        center: defaultCenter,
        zoom: 5,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      };
      const map = new google.maps.Map(mapRef.current, mapOptions);
      googleMapRef.current = map;

      const input = document.getElementById('venue-map-search') as HTMLInputElement;
      if (input) {
        const searchBox = new google.maps.places.SearchBox(input);
        searchBoxRef.current = searchBox;
        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();
          if (!places || places.length === 0) return;

          clearMapMarkers();
          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          if (selectedCity) {
            const addressComponents = place.address_components || [];
            const cityComponent = addressComponents.find(component =>
              component.types.includes('locality')
            );
            if (cityComponent) {
              const placeCity = cityComponent.long_name.toLowerCase();
              const selectedCityObj = CITIES.find(c => c.value === selectedCity);
              if (selectedCityObj && !placeCity.includes(selectedCityObj.label.toLowerCase())) {
                toast({
                  title: "City Mismatch",
                  description: "The selected location does not match the chosen city.",
                  variant: "destructive"
                });
                return;
              }
            }
          }

          const addressComponents = place.address_components || [];
          let city = '', state = '', country = '', postalCode = '';
          addressComponents.forEach(component => {
            const types = component.types;
            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            } else if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });
          venueFormik.setFieldValue('name', place.name || 'New Venue');
          venueFormik.setFieldValue('address', place.formatted_address || '');
          venueFormik.setFieldValue('city', city);
          venueFormik.setFieldValue('state', state);
          venueFormik.setFieldValue('zipCode', postalCode);
          venueFormik.setFieldValue('country', country || 'India');
          venueFormik.setFieldValue('latitude', place.geometry.location.lat());
          venueFormik.setFieldValue('longitude', place.geometry.location.lng());
          setSearchQuery(place.name || '');

          const bounds = new google.maps.LatLngBounds();
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
          map.fitBounds(bounds);

          const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            animation: google.maps.Animation.DROP,
          });
          markersRef.current.push(marker);
        });
        map.addListener('bounds_changed', () => {
          searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
        });
      }

      if (selectedCity) {
        const cityObj = CITIES.find(c => c.value === selectedCity);
        if (cityObj) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: cityObj.label }, (results, status) => {
            if (status === "OK" && results && results[0] && results[0].geometry) {
              map.setCenter(results[0].geometry.location);
              map.setZoom(12);
            }
          });
        }
      }
    }

    return () => {
      clearMapMarkers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMethod, isLoaded, loadError, selectedCity]);

  // Handle city selection.
  const handleCitySelect = (cityValue: string) => {
    venueFormik.setFieldValue('city', cityValue);
    setSelectedCity(cityValue);
    setCityOpen(false);
    if (googleMapRef.current && isLoaded) {
      const cityObj = CITIES.find(c => c.value === cityValue);
      if (cityObj) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: cityObj.label }, (results, status) => {
          if (status === "OK" && results && results[0] && results[0].geometry) {
            googleMapRef.current?.setCenter(results[0].geometry.location);
            googleMapRef.current?.setZoom(12);
          }
        });
      }
    }
  };

  // Handle map search via geocoder.
  const handleMapSearch = () => {
    if (!isLoaded || !searchQuery) return;
    const geocoder = new google.maps.Geocoder();
    let searchTerm = searchQuery;
    if (selectedCity) {
      const cityObj = CITIES.find(c => c.value === selectedCity);
      if (cityObj) {
        searchTerm = `${searchTerm}, ${cityObj.label}`;
      }
    }
    geocoder.geocode({ address: searchTerm }, (results, status) => {
      if (status === "OK" && results && results[0] && googleMapRef.current) {
        const place = results[0];
        googleMapRef.current.setCenter(place.geometry.location);
        googleMapRef.current.setZoom(15);
        clearMapMarkers();

        const addressComponents = place.address_components || [];
        let city = '', state = '', country = '', postalCode = '';
        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
          } else if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });
        venueFormik.setFieldValue('name', searchQuery || 'New Venue');
        venueFormik.setFieldValue('address', place.formatted_address || '');
        venueFormik.setFieldValue('city', city);
        venueFormik.setFieldValue('state', state);
        venueFormik.setFieldValue('zipCode', postalCode);
        venueFormik.setFieldValue('country', country || 'India');
        venueFormik.setFieldValue('latitude', place.geometry.location.lat());
        venueFormik.setFieldValue('longitude', place.geometry.location.lng());

        const marker = new google.maps.Marker({
          map: googleMapRef.current,
          position: place.geometry.location,
          animation: google.maps.Animation.DROP,
        });
        markersRef.current.push(marker);
      } else {
        toast({
          title: "Search Error",
          description: "Could not find the location. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Venues</h2>

        <Tabs defaultValue="manual" onValueChange={(value) => setAddMethod(value as 'manual' | 'map')}>
          <TabsList className="mb-4">
            <TabsTrigger value="manual">Add Manually</TabsTrigger>
            <TabsTrigger value="map">Select from Map</TabsTrigger>
          </TabsList>

          {/* Manually Adding or Editing a Venue */}
          <TabsContent value="manual" className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {editingVenueId ? "Edit Venue" : "Add New Venue"}
            </h3>

            <form onSubmit={venueFormik.handleSubmit}>
              <div className="flex items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tba"
                    checked={venueFormik.values.tba}
                    onCheckedChange={(checked) => venueFormik.setFieldValue('tba', checked)}
                    className="data-[state=checked]:bg-[#24005b]"
                  />
                  <Label htmlFor="tba">Venue to be Announced (TBA)</Label>
                </div>
                <div className="ml-2 text-xs text-gray-500">
                  {venueFormik.values.tba && "(Only city selection is required)"}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {!venueFormik.values.tba && (
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
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                  <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={cityOpen}
                        className={`w-full justify-between ${venueFormik.errors.city && venueFormik.touched.city ? "border-red-500" : ""}`}
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
                              onSelect={(currentValue) => handleCitySelect(currentValue)}
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

                {!venueFormik.values.tba && (
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

              {/* Additional Latitude and Longitude Fields for manual entry when not TBA */}
              {!venueFormik.values.tba && (
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      value={venueFormik.values.latitude ?? ''}
                      onChange={venueFormik.handleChange}
                      onBlur={venueFormik.handleBlur}
                      placeholder="Enter latitude"
                      className={venueFormik.errors.latitude && venueFormik.touched.latitude ? "border-red-500" : ""}
                    />
                    {venueFormik.errors.latitude && venueFormik.touched.latitude &&
                      <p className="text-red-500 text-sm">{venueFormik.errors.latitude}</p>
                    }
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      value={venueFormik.values.longitude ?? ''}
                      onChange={venueFormik.handleChange}
                      onBlur={venueFormik.handleBlur}
                      placeholder="Enter longitude"
                      className={venueFormik.errors.longitude && venueFormik.touched.longitude ? "border-red-500" : ""}
                    />
                    {venueFormik.errors.longitude && venueFormik.touched.longitude &&
                      <p className="text-red-500 text-sm">{venueFormik.errors.longitude}</p>
                    }
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="mt-4 flex items-center"
                variant="secondary"
              >
                <Plus className="h-4 w-4 mr-2" /> {editingVenueId ? "Update Venue" : "Add Venue"}
              </Button>
            </form>
          </TabsContent>

          {/* Adding Venue via Map */}
          <TabsContent value="map" className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-3 flex items-center">
              <Map className="h-4 w-4 mr-2" />
              {editingVenueId ? "Edit Venue (Map)" : "Select Venue from Map"}
            </h3>

            <div className="mb-4">
              <Label htmlFor="venue-city-filter" className="mb-1 block">Filter By City</Label>
              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityOpen}
                    className={`w-full justify-between mb-2 ${venueFormik.errors.city && venueFormik.touched.city ? "border-red-500" : ""}`}
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
                          onSelect={(currentValue) => handleCitySelect(currentValue)}
                        >
                          <span>{city.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex gap-2">
                <Input
                  id="venue-map-search"
                  placeholder={selectedCity
                    ? `Search venues in ${CITIES.find(c => c.value === selectedCity)?.label || selectedCity}`
                    : "Search for a venue..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  disabled={!isLoaded}
                />
                <Button
                  variant="secondary"
                  className="flex items-center"
                  onClick={handleMapSearch}
                  disabled={!isLoaded || !searchQuery}
                >
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>

              {!isLoaded && (
                <p className="text-xs text-amber-600 mt-1">Loading Google Maps API...</p>
              )}
              {loadError && (
                <p className="text-xs text-red-500 mt-1">Error loading Google Maps: {loadError.message}</p>
              )}
            </div>

            <div
              ref={mapRef}
              className="h-80 border border-gray-300 rounded-md mb-4 bg-gray-100 flex items-center justify-center"
            >
              {!isLoaded && (
                <div className="flex flex-col items-center justify-center">
                  <MapPin className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Loading map...</p>
                </div>
              )}
            </div>

            {isLoaded && (
              <form onSubmit={venueFormik.handleSubmit}>
                <div className="space-y-4">
                  <h4 className="font-medium">Selected Venue</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={venueFormik.values.address}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter address"
                        className={venueFormik.errors.address && venueFormik.touched.address ? "border-red-500" : ""}
                      />
                      {venueFormik.errors.address && venueFormik.touched.address &&
                        <p className="text-red-500 text-sm">{venueFormik.errors.address}</p>
                      }
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={venueFormik.values.city}
                        onChange={venueFormik.handleChange}
                        onBlur={venueFormik.handleBlur}
                        placeholder="Enter city"
                        className={venueFormik.errors.city && venueFormik.touched.city ? "border-red-500" : ""}
                      />
                      {venueFormik.errors.city && venueFormik.touched.city &&
                        <p className="text-red-500 text-sm">{venueFormik.errors.city}</p>
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
                      />
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
                      />
                    </div>
                  </div>

                  {/* Additional Latitude and Longitude Fields */}
                  {!venueFormik.values.tba && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          name="latitude"
                          type="number"
                          value={venueFormik.values.latitude ?? ''}
                          onChange={venueFormik.handleChange}
                          onBlur={venueFormik.handleBlur}
                          placeholder="Enter latitude"
                          className={venueFormik.errors.latitude && venueFormik.touched.latitude ? "border-red-500" : ""}
                        />
                        {venueFormik.errors.latitude && venueFormik.touched.latitude &&
                          <p className="text-red-500 text-sm">{venueFormik.errors.latitude}</p>
                        }
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          name="longitude"
                          type="number"
                          value={venueFormik.values.longitude ?? ''}
                          onChange={venueFormik.handleChange}
                          onBlur={venueFormik.handleBlur}
                          placeholder="Enter longitude"
                          className={venueFormik.errors.longitude && venueFormik.touched.longitude ? "border-red-500" : ""}
                        />
                        {venueFormik.errors.longitude && venueFormik.touched.longitude &&
                          <p className="text-red-500 text-sm">{venueFormik.errors.longitude}</p>
                        }
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="flex items-center"
                    variant="secondary"
                    disabled={!venueFormik.values.name || !venueFormik.values.city}
                  >
                    <Plus className="h-4 w-4 mr-2" /> {editingVenueId ? "Update Selected Venue" : "Add Selected Venue"}
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
                    <h4 className="font-medium">
                      {venue.tba ? `tba Venue in ${venue.city}` : venue.name}
                    </h4>
                    {!venue.tba && (
                      <p className="text-sm text-gray-600">
                        {venue.address}, {venue.city}, {venue.state} {venue.zipCode}
                      </p>
                    )}
                    {venue.tba && (
                      <p className="text-sm text-gray-600">Location will be determined later</p>
                    )}
                    {venue.capacity && <p className="text-xs text-gray-500">Capacity: {venue.capacity}</p>}
                    {venue.latitude && venue.longitude && (
                      <p className="text-xs text-gray-500">
                        Location: {venue.latitude.toFixed(6)}, {venue.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditVenue(venue)}
                      className="text-purple-950"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveVenue(venue.id)}
                      className="text-purple-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={handleSubmit} className="flex items-center">
            Next: Dates <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

