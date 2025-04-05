
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { MapPin, Search } from 'lucide-react';

interface VenueSelectorProps {
  onSelectVenue: (venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    lat: number;
    lng: number;
  }) => void;
  defaultValue?: string;
}

export function VenueSelector({ onSelectVenue, defaultValue }: VenueSelectorProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue || '');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService (required by the API)
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 1
        });
        placesService.current = new google.maps.places.PlacesService(map);
      }
    }
  }, []);

  const handleSearch = () => {
    if (!autocompleteService.current || searchQuery.trim() === '') {
      setPredictions([]);
      return;
    }

    const request = {
      input: searchQuery,
      types: ['establishment', 'geocode']
    };

    autocompleteService.current.getPlacePredictions(
      request,
      (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setPredictions([]);
          return;
        }
        setPredictions(predictions);
        setShowPredictions(true);
      }
    );
  };

  const handleSelectPrediction = (placeId: string) => {
    if (!placesService.current) return;

    const request = {
      placeId,
      fields: ['name', 'formatted_address', 'address_components', 'geometry']
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;

      let city = '';
      let state = '';
      let country = '';
      let postalCode = '';

      place.address_components?.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (component.types.includes('country')) {
          country = component.long_name;
        } else if (component.types.includes('postal_code')) {
          postalCode = component.long_name;
        }
      });

      onSelectVenue({
        name: place.name || '',
        address: place.formatted_address || '',
        city,
        state,
        country,
        postalCode,
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0
      });

      setSearchQuery(place.name || '');
      setShowPredictions(false);
    });
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for venue by name or address"
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>
        <Button type="button" variant="outline" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-10 w-full bg-white rounded-md border shadow-lg max-h-60 overflow-auto mt-1">
          {predictions.map((prediction) => (
            <div 
              key={prediction.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleSelectPrediction(prediction.place_id)}
            >
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <div>
                <div className="font-medium">{prediction.structured_formatting.main_text}</div>
                <div className="text-sm text-gray-500">{prediction.structured_formatting.secondary_text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Hidden map div for PlacesService */}
      <div ref={mapRef} style={{ display: 'none' }}></div>
    </div>
  );
}
