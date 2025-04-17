import React from 'react';
import { Label } from './label';
import { Checkbox } from './checkbox';

interface ProhibitedItem {
  id: string;
  label: string;
}

const COMMON_PROHIBITED_ITEMS: ProhibitedItem[] = [
  { id: 'weapons', label: 'Weapons of any kind' },
  { id: 'alcohol', label: 'Outside alcohol' },
  { id: 'drugs', label: 'Illegal substances' },
  { id: 'glass', label: 'Glass containers' },
  { id: 'cans', label: 'Cans or metal containers' },
  { id: 'bottles', label: 'Plastic bottles over 1L' },
  { id: 'food', label: 'Outside food and beverages' },
  { id: 'pets', label: 'Pets (except service animals)' },
  { id: 'cameras', label: 'Professional cameras without credentials' },
  { id: 'drones', label: 'Drones or aerial equipment' },
  { id: 'selfie', label: 'Selfie sticks' },
  { id: 'fireworks', label: 'Fireworks or explosives' },
  { id: 'lasers', label: 'Laser pointers' },
  { id: 'megaphone', label: 'Megaphones or sound amplifiers' },
  { id: 'flags', label: 'Large flags or banners' },
  { id: 'chairs', label: 'Chairs or furniture' },
  { id: 'skateboards', label: 'Skateboards, scooters, or bicycles' },
  { id: 'markers', label: 'Permanent markers or spray paint' },
  { id: 'instruments', label: 'Musical instruments' },
  { id: 'flammable', label: 'Flammable materials' },
];

interface ProhibitedItemsProps {
  selectedItems: string[];
  onChange: (selectedItems: string[]) => void;
}

export function ProhibitedItems({
  selectedItems,
  onChange,
}: ProhibitedItemsProps) {
  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onChange(selectedItems.filter((id) => id !== itemId));
    } else {
      onChange([...selectedItems, itemId]);
    }
  };

  return (
    <div className='space-y-4'>
      <Label className='text-base font-medium'>Prohibited Items</Label>
      <p className='text-sm text-muted-foreground'>
        Select items that are prohibited at your event. This will be displayed
        on the event details page.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2'>
        {COMMON_PROHIBITED_ITEMS.map((item) => (
          <div key={item.id} className='flex items-center space-x-2'>
            <Checkbox
              id={`prohibited-${item.id}`}
              checked={selectedItems.includes(item.id)}
              onCheckedChange={() => toggleItem(item.id)}
            />
            <Label
              htmlFor={`prohibited-${item.id}`}
              className='text-sm cursor-pointer'
            >
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
