
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, ArrowUp, ArrowDown, Upload, Image } from 'lucide-react';
import { Sponsor } from './types';

interface SponsorSectionProps {
    sponsors: Sponsor[];
    onChange: (sponsors: Sponsor[]) => void;
}

export const SponsorSection: React.FC<SponsorSectionProps> = ({
    sponsors,
    onChange
}) => {
    const [newSponsor, setNewSponsor] = useState<{
        brandName: string;
        brandLogo: string;
    }>({
        brandName: '',
        brandLogo: '',
    });

    const [isDragging, setIsDragging] = useState(false);

    const handleAddSponsor = () => {
        if (newSponsor.brandName.trim() === '') return;

        const updatedSponsors = [
            ...sponsors,
            {
                ...newSponsor,
                priority: sponsors.length + 1,
            },
        ];

        onChange(updatedSponsors);
        setNewSponsor({ brandName: '', brandLogo: '' });
    };

    const handleRemoveSponsor = (index: number) => {
        const updatedSponsors = sponsors.filter((_, i) => i !== index);
        onChange(updatedSponsors);
    };

    const handleMoveSponsor = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === sponsors.length - 1)
        ) {
            return;
        }

        const updatedSponsors = [...sponsors];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [updatedSponsors[index], updatedSponsors[targetIndex]] =
            [updatedSponsors[targetIndex], updatedSponsors[index]];

        // Update priorities
        updatedSponsors.forEach((sponsor, idx) => {
            sponsor.priority = idx + 1;
        });

        onChange(updatedSponsors);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setNewSponsor(prev => ({
                ...prev,
                brandLogo: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    // Drag and drop handlers
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.match('image.*')) {
                processFile(file);
            }
        }
    }, []);

    return (
        <Card className="border border-muted">
            <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Event Sponsors</h3>

                {/* Add new sponsor form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                    <div>
                        <Label htmlFor="brandName">Sponsor Name</Label>
                        <Input
                            id="brandName"
                            value={newSponsor.brandName}
                            onChange={(e) => setNewSponsor(prev => ({ ...prev, brandName: e.target.value }))}
                            placeholder="Enter sponsor name"
                        />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="brandLogo">Sponsor Logo</Label>
                        <div
                            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${isDragging ? 'border-[#9b87f5] bg-[#e5deff]' : 'border-gray-300'
                                }`}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {newSponsor.brandLogo ? (
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <img
                                            src={newSponsor.brandLogo}
                                            alt="Preview"
                                            className="h-32 w-auto object-contain"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setNewSponsor(prev => ({ ...prev, brandLogo: '' }))}
                                        >
                                            <X className="mr-1 h-4 w-4" /> Remove
                                        </Button>
                                        <label
                                            htmlFor="brandLogo"
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                                        >
                                            <Upload className="mr-1 h-4 w-4" /> Change
                                            <input
                                                id="brandLogo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1 text-center">
                                    <div className="flex justify-center">
                                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                                    </div>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="brandLogo"
                                            className="relative cursor-pointer rounded-md font-medium text-[#9b87f5] hover:text-[#7E69AB] focus-within:outline-none"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="brandLogo"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleLogoChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <Button
                            onClick={handleAddSponsor}
                            className="flex items-center justify-center w-full bg-[#24005b] hover:bg-[#36127d] text-white"
                            disabled={!newSponsor.brandName || !newSponsor.brandLogo}
                        >
                            <Plus className="mr-1 h-4 w-4" /> Add Sponsor
                        </Button>
                    </div>
                </div>

                {/* Sponsors list */}
                {sponsors.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-medium">Current Sponsors</h4>
                        <div className="grid gap-3">
                            {sponsors.map((sponsor, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 border rounded-md">
                                    <div className="w-16 h-16 flex-shrink-0">
                                        <img
                                            src={sponsor.brandLogo}
                                            alt={sponsor.brandName}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <div className="flex-grow">
                                        <p className="font-medium">{sponsor.brandName}</p>
                                        <p className="text-sm text-gray-500">Priority: {sponsor.priority}</p>
                                    </div>

                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMoveSponsor(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMoveSponsor(index, 'down')}
                                            disabled={index === sponsors.length - 1}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveSponsor(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

