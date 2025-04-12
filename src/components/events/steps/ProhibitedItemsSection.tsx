import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ProhibitedItem } from './types';

interface ProhibitedItemsSectionProps {
    selectedItems: string[];
    onChange: (selectedItems: string[]) => void;
    prohibitedItems: ProhibitedItem[];
}

export const ProhibitedItemsSection: React.FC<ProhibitedItemsSectionProps> = ({
    selectedItems,
    onChange,
    prohibitedItems
}) => {
    const handleItemToggle = (itemId: string) => {
        if (selectedItems.includes(itemId)) {
            onChange(selectedItems.filter(id => id !== itemId));
        } else {
            onChange([...selectedItems, itemId]);
        }
    };

    return (
        <Card className="border border-muted">
            <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Prohibited Items</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Select items that are not allowed at your event:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {prohibitedItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => handleItemToggle(item.id)}
                            />
                            <Label
                                htmlFor={`item-${item.id}`}
                                className="text-sm cursor-pointer"
                            >
                                {item.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
