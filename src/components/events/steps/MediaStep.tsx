
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, FileImage, Youtube, Trash2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface MediaFormValues {
  galleryImages: (string | File)[];
  cardImage?: File;
  bannerImage?: File; // Changed to match expected type
  verticalBannerImage?: File;
  youtubeLink?: string;
}

interface MediaStepProps {
  media: MediaFormValues;
  onSubmit: (media: MediaFormValues) => void;
  onBack: () => void;
}

export const MediaStep: React.FC<MediaStepProps> = ({ media, onSubmit, onBack }) => {
  const [mediaData, setMediaData] = useState<MediaFormValues>(media);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateYoutubeUrl = (url: string) => {
    if (!url) return true;
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof MediaFormValues) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (type === 'galleryImages') {
      // Add to gallery images
      const newGalleryImages = [...mediaData.galleryImages];
      
      for (let i = 0; i < files.length; i++) {
        // Check file type
        if (!files[i].type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: "Only image files are allowed.",
            variant: "destructive"
          });
          continue;
        }
        
        newGalleryImages.push(files[i]);
      }
      
      setMediaData({
        ...mediaData,
        galleryImages: newGalleryImages
      });
    } else {
      // Check file type
      if (!files[0].type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed.",
          variant: "destructive"
        });
        return;
      }
      
      // For single image fields
      setMediaData({
        ...mediaData,
        [type]: files[0]
      });
      
      toast({
        title: "Image uploaded",
        description: `${type.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} has been updated.`
      });
    }
    
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  const handleRemoveImage = (type: keyof MediaFormValues, index?: number) => {
    if (type === 'galleryImages' && typeof index === 'number') {
      const newGalleryImages = [...mediaData.galleryImages];
      newGalleryImages.splice(index, 1);
      
      setMediaData({
        ...mediaData,
        galleryImages: newGalleryImages
      });
      
      toast({
        title: "Image removed",
        description: "The gallery image has been removed."
      });
    } else {
      // For single image fields
      setMediaData({
        ...mediaData,
        [type]: undefined
      });
      
      toast({
        title: "Image removed",
        description: `${type.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} has been removed.`
      });
    }
  };

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setMediaData({
      ...mediaData,
      youtubeLink: value
    });
    
    if (value && !validateYoutubeUrl(value)) {
      setErrors({
        ...errors,
        youtubeLink: 'Please enter a valid YouTube URL'
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors.youtubeLink;
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    // Validate YouTube link if present
    if (mediaData.youtubeLink && !validateYoutubeUrl(mediaData.youtubeLink)) {
      setErrors({
        ...errors,
        youtubeLink: 'Please enter a valid YouTube URL'
      });
      
      toast({
        title: "Validation Error",
        description: "Please enter a valid YouTube URL.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(mediaData);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Event Media</h2>
        
        <Tabs defaultValue="images">
          <TabsList className="mb-4">
            <TabsTrigger value="images" className="flex items-center">
              <FileImage className="h-4 w-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center">
              <Youtube className="h-4 w-4 mr-2" />
              Video
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="images">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Card Image */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Card Image</h3>
                <p className="text-sm text-gray-500 mb-4">This image will be used for event cards and previews (Recommended: 600x400px)</p>
                
                {mediaData.cardImage ? (
                  <div className="relative mb-4">
                    <img
                      src={URL.createObjectURL(mediaData.cardImage)}
                      alt="Card Preview"
                      className="w-full h-40 object-cover rounded border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => handleRemoveImage('cardImage')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg flex flex-col items-center justify-center h-40 mb-4 bg-white">
                    <FileImage className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="cardImage" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{mediaData.cardImage ? 'Change Image' : 'Upload Image'}</span>
                    </div>
                    <Input
                      id="cardImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'cardImage')}
                    />
                  </Label>
                </div>
              </div>
              
              {/* Banner Image */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Banner Image</h3>
                <p className="text-sm text-gray-500 mb-4">This image will be displayed at the top of your event page (Recommended: 1200x300px)</p>
                
                {mediaData.bannerImage ? (
                  <div className="relative mb-4">
                    <img
                      src={URL.createObjectURL(mediaData.bannerImage)}
                      alt="Banner Preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => handleRemoveImage('bannerImage')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg flex flex-col items-center justify-center h-32 mb-4 bg-white">
                    <FileImage className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="bannerImage" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{mediaData.bannerImage ? 'Change Image' : 'Upload Image'}</span>
                    </div>
                    <Input
                      id="bannerImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'bannerImage')}
                    />
                  </Label>
                </div>
              </div>
              
              {/* Vertical Banner Image */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Vertical Banner</h3>
                <p className="text-sm text-gray-500 mb-4">This image will be used for mobile views and vertical layouts (Recommended: 800x1200px)</p>
                
                {mediaData.verticalBannerImage ? (
                  <div className="relative mb-4">
                    <img
                      src={URL.createObjectURL(mediaData.verticalBannerImage)}
                      alt="Vertical Banner Preview"
                      className="w-full h-40 object-cover rounded border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                      onClick={() => handleRemoveImage('verticalBannerImage')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg flex flex-col items-center justify-center h-40 mb-4 bg-white">
                    <FileImage className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="verticalBannerImage" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{mediaData.verticalBannerImage ? 'Change Image' : 'Upload Image'}</span>
                    </div>
                    <Input
                      id="verticalBannerImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'verticalBannerImage')}
                    />
                  </Label>
                </div>
              </div>
              
              {/* Gallery Images */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Gallery Images</h3>
                <p className="text-sm text-gray-500 mb-4">Add multiple images for your event gallery</p>
                
                {mediaData.galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {mediaData.galleryImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Gallery Image ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 bg-black/50 text-white hover:bg-black/70 h-6 w-6"
                          onClick={() => handleRemoveImage('galleryImages', index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg flex flex-col items-center justify-center h-40 mb-4 bg-white">
                    <FileImage className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No gallery images selected</p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="galleryImages" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Add Gallery Images</span>
                    </div>
                    <Input
                      id="galleryImages"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'galleryImages')}
                    />
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="video">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">YouTube Video</h3>
              <p className="text-sm text-gray-500 mb-4">Add a YouTube video link for your event</p>
              
              <div className="space-y-2">
                <Label htmlFor="youtubeLink">YouTube URL</Label>
                <Input
                  id="youtubeLink"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={mediaData.youtubeLink || ''}
                  onChange={handleYoutubeLinkChange}
                  className={errors.youtubeLink ? "border-red-500" : ""}
                />
                {errors.youtubeLink && <p className="text-red-500 text-sm">{errors.youtubeLink}</p>}
              </div>
              
              {mediaData.youtubeLink && !errors.youtubeLink && (
                <div className="mt-4 border rounded bg-white p-2">
                  <p className="text-sm font-medium">YouTube video added:</p>
                  <p className="text-sm text-gray-600 truncate">{mediaData.youtubeLink}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

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
            Next: Additional Info <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
