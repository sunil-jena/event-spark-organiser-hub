
import React, { useState } from 'react';
import { Button } from './button';
import { Label } from './label';
import { ImageIcon, UploadCloud, X, Image as ImageLucide, Layout, File } from 'lucide-react';

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  type: 'banner' | 'gallery' | 'card' | 'thumbnail';
}

interface MultiImageUploadProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxFiles?: number;
}

export function MultiImageUpload({ images, onChange, maxFiles = 10 }: MultiImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'gallery' | 'card' | 'thumbnail') => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      newImages.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        type
      });
    });

    // Respect the type limit - replace existing images of the same type
    const filteredExisting = images.filter(img => img.type !== type);
    
    if (type === 'banner' || type === 'card' || type === 'thumbnail') {
      // For single-image types, only use the first new image
      onChange([...filteredExisting, ...(newImages.slice(0, 1))]);
    } else {
      // For gallery, respect the maxFiles limit across all images
      const combinedImages = [...filteredExisting, ...newImages];
      if (combinedImages.length > maxFiles) {
        onChange(combinedImages.slice(0, maxFiles));
      } else {
        onChange(combinedImages);
      }
    }
    
    // Reset the input
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    onChange(images.filter(image => image.id !== id));
  };

  const getThumbnails = (type: 'banner' | 'gallery' | 'card' | 'thumbnail') => {
    return images.filter(img => img.type === type).map(image => (
      <div key={image.id} className="relative group">
        <img 
          src={image.preview} 
          alt={`Uploaded ${image.file.name}`}
          className="object-cover rounded-md"
          style={{ 
            height: type === 'banner' ? '150px' : type === 'card' ? '120px' : '100px',
            width: type === 'banner' ? '100%' : type === 'card' ? '100%' : '100px'
          }}
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => removeImage(image.id)}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center truncate">
          {image.file.name}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-base">Banner Image</Label>
          <span className="text-xs text-muted-foreground">Recommended size: 1920 x 1080px</span>
        </div>
        <div className="border-2 border-dashed rounded-md p-4 text-center">
          {getThumbnails('banner').length > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-center">{getThumbnails('banner')}</div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('banner-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" /> Change Banner Image
              </Button>
            </div>
          ) : (
            <div className="py-4">
              <Layout className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your banner image, or click to browse
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('banner-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" /> Upload Banner
              </Button>
            </div>
          )}
          <input
            id="banner-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'banner')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-base">Card Image</Label>
          <span className="text-xs text-muted-foreground">Recommended size: 600 x 400px</span>
        </div>
        <div className="border-2 border-dashed rounded-md p-4 text-center">
          {getThumbnails('card').length > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-center">{getThumbnails('card')}</div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('card-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" /> Change Card Image
              </Button>
            </div>
          ) : (
            <div className="py-4">
              <ImageLucide className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                This image will appear on event cards in listings
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('card-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" /> Upload Card Image
              </Button>
            </div>
          )}
          <input
            id="card-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'card')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-base">Thumbnail</Label>
          <span className="text-xs text-muted-foreground">Recommended size: 300 x 300px</span>
        </div>
        <div className="border-2 border-dashed rounded-md p-4 text-center">
          {getThumbnails('thumbnail').length > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-center">{getThumbnails('thumbnail')}</div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('thumbnail-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" /> Change Thumbnail
              </Button>
            </div>
          ) : (
            <div className="py-4">
              <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Used for thumbnails in search results
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('thumbnail-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" /> Upload Thumbnail
              </Button>
            </div>
          )}
          <input
            id="thumbnail-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'thumbnail')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-base">Gallery Images</Label>
          <span className="text-xs text-muted-foreground">{images.filter(img => img.type === 'gallery').length} of {maxFiles} images</span>
        </div>
        <div className="border-2 border-dashed rounded-md p-4">
          {getThumbnails('gallery').length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {getThumbnails('gallery')}
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  disabled={images.filter(img => img.type === 'gallery').length >= maxFiles}
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                >
                  <UploadCloud className="h-4 w-4 mr-2" /> 
                  Add More Gallery Images
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <File className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Add multiple images to your event gallery
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('gallery-upload')?.click()}
              >
                <UploadCloud className="h-4 w-4 mr-2" /> Upload Gallery Images
              </Button>
            </div>
          )}
          <input
            id="gallery-upload"
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'gallery')}
          />
        </div>
      </div>
    </div>
  );
}
