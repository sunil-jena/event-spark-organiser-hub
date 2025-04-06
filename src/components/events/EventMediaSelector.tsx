
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, FileText, Film } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EventMediaSelectorProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
}

export const EventMediaSelector: React.FC<EventMediaSelectorProps> = ({
  value,
  onChange,
  maxFiles = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    addFiles(Array.from(files));
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Validate file type
    const validFiles = newFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid File Type",
        description: "Some files were skipped because they are not supported.",
        variant: "destructive",
      });
    }

    // Check if adding these files would exceed the limit
    if (value.length + validFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `You can upload a maximum of ${maxFiles} files.`,
        variant: "destructive",
      });
      
      // Only add files up to the limit
      const remainingSlots = maxFiles - value.length;
      validFiles.splice(remainingSlots);
    }

    onChange([...value, ...validFiles]);
  };

  const removeFile = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-10 w-10 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Film className="h-10 w-10 text-purple-500" />;
    }
    return <FileText className="h-10 w-10 text-gray-500" />;
  };

  const getFilePreview = (file: File, index: number) => {
    // For images, show a thumbnail
    if (file.type.startsWith('image/')) {
      return (
        <div key={index} className="relative">
          <div className="rounded-md overflow-hidden h-32 w-32 bg-gray-100 flex items-center justify-center">
            <img 
              src={URL.createObjectURL(file)} 
              alt={file.name} 
              className="h-full w-full object-cover"
            />
          </div>
          <button 
            type="button"
            onClick={() => removeFile(index)} 
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mt-1 text-xs text-center truncate max-w-[128px]">
            {file.name}
          </div>
        </div>
      );
    }
    
    // For other files, show an icon
    return (
      <div key={index} className="relative">
        <div className="rounded-md overflow-hidden h-32 w-32 bg-gray-100 flex flex-col items-center justify-center p-2">
          {getFileIcon(file)}
          <div className="mt-2 text-xs text-center truncate max-w-[120px]">
            {file.name}
          </div>
        </div>
        <button 
          type="button"
          onClick={() => removeFile(index)} 
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="event-media">Event Media (Optional)</Label>
        <p className="text-sm text-gray-500 mb-2">
          Upload images, videos, or PDFs for your event. Max {maxFiles} files.
        </p>
        
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Input
            id="event-media"
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept={allowedTypes.join(',')}
            ref={fileInputRef}
          />
          
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-lg font-medium">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">or</p>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Supported: JPG, PNG, GIF, PDF, MP4 (max 10MB per file)
            </p>
          </div>
        </div>
      </div>
      
      {value.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Uploaded Files ({value.length}/{maxFiles})</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {value.map((file, index) => getFilePreview(file, index))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
