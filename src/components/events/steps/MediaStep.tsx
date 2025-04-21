import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileImage,
  Youtube,
  Trash2,
  Upload,
  Image,
  GalleryHorizontal,
  Video,
  ExternalLink,
  Info,
  MoveUp,
  MoveDown,
  Cross,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  validateYoutubeUrl,
  isValidImageFile,
  isValidVideoFile,
  getImageUrl,
  formatFileSize,
  moveImagePosition,
} from '@/utils/mediaHelpers';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MediaFormValues } from './types';

interface MediaUploadFormProps {
  initialValues?: Partial<MediaFormValues>;
  onSubmit: (values: MediaFormValues) => void;
  onBack?: () => void;
}

const validationSchema = Yup.object({
  youtubeLink: Yup.string().test(
    'is-valid-youtube',
    'Please enter a valid YouTube URL',
    (value) => {
      if (!value) return true;
      return validateYoutubeUrl(value);
    }
  ),
});

const MediaStep: React.FC<MediaUploadFormProps> = ({
  initialValues,
  onSubmit,
  onBack,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getVideoSrc = (video: File | string) =>
    typeof video === 'string' ? video : URL.createObjectURL(video);

  const defaultValues: MediaFormValues = {
    eventcardImage: null,
    eventVerticalCardImage: null,
    eventBannerImage: [],
    eventVerticalBannerImage: [],
    galleryImages: [],
    youtubeLink: '',
    eventVerticalVideo: null,
  };

  const formik = useFormik({
    initialValues: { ...defaultValues, ...initialValues },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof MediaFormValues,
    multiple: boolean = false
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // For multiple file fields (gallery, banner images)
    if (multiple) {
      const newFiles: (File | string)[] = [
        ...(formik.values[fieldName] as (File | string)[]),
      ];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (fieldName === 'eventVerticalVideo') {
          if (isValidVideoFile(file)) {
            formik.setFieldValue(fieldName, file);
            toast({
              title: 'Video uploaded',
              description:
                'Your video has been added for improved CTR performance.',
            });
          } else {
            toast({
              title: 'Invalid file type',
              description: 'Only video files are allowed.',
              variant: 'destructive',
            });
          }
          continue;
        }

        // For image fields
        if (isValidImageFile(file)) {
          newFiles.push(file);
        } else {
          toast({
            title: 'Invalid file type',
            description: 'Only image files are allowed.',
            variant: 'destructive',
          });
        }
      }

      formik.setFieldValue(fieldName, newFiles);
    }
    // For single file fields
    else {
      const file = files[0];

      if (fieldName === 'eventVerticalVideo') {
        if (isValidVideoFile(file)) {
          formik.setFieldValue(fieldName, file);
          toast({
            title: 'Video uploaded',
            description:
              'Your video has been added for improved CTR performance.',
          });
        } else {
          toast({
            title: 'Invalid file type',
            description: 'Only video files are allowed.',
            variant: 'destructive',
          });
        }
        return;
      }

      if (isValidImageFile(file)) {
        formik.setFieldValue(fieldName, file);
        toast({
          title: 'Image uploaded',
          description: `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} has been updated for optimal CTR.`,
        });
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Only image files are allowed.',
          variant: 'destructive',
        });
      }
    }

    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  const handleRemoveFile = (
    fieldName: keyof MediaFormValues,
    index?: number
  ) => {
    // For multiple file fields
    if (
      (fieldName === 'galleryImages' ||
        fieldName === 'eventBannerImage' ||
        fieldName === 'eventVerticalBannerImage') &&
      typeof index === 'number'
    ) {
      const files = [...(formik.values[fieldName] as (File | string)[])];
      files.splice(index, 1);

      formik.setFieldValue(fieldName, files);

      toast({
        title: 'Image removed',
        description: `The ${fieldName === 'galleryImages' ? 'gallery' : fieldName === 'eventBannerImage' ? 'banner' : 'vertical banner'} image has been removed.`,
      });
    }
    // For single file fields
    else {
      formik.setFieldValue(fieldName, null);

      toast({
        title: 'File removed',
        description: `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} has been removed.`,
      });
    }
  };

  // New function to handle moving images up and down for reordering
  const handleMoveImage = (
    fieldName:
      | 'galleryImages'
      | 'eventBannerImage'
      | 'eventVerticalBannerImage',
    currentIndex: number,
    direction: 'up' | 'down'
  ) => {
    const images = [...(formik.values[fieldName] as (File | string)[])];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    // Check if the new index is within bounds
    if (newIndex < 0 || newIndex >= images.length) {
      return;
    }

    const reorderedImages = moveImagePosition(images, currentIndex, newIndex);
    formik.setFieldValue(fieldName, reorderedImages);

    toast({
      title: 'Image reordered',
      description: `The image has been moved ${direction}.`,
    });
  };

  const openImagePreview = (image: File | string) => {
    const imageUrl = getImageUrl(image);
    setPreviewImage(imageUrl);
  };

  // Helper to render reordering buttons for multiple images
  const renderReorderButtons = (
    fieldName:
      | 'galleryImages'
      | 'eventBannerImage'
      | 'eventVerticalBannerImage',
    index: number,
    totalImages: number
  ) => {
    return (
      <div className='absolute bottom-1 left-1 flex space-x-1'>
        {index > 0 && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='bg-black/50 text-white hover:bg-black/70 h-6 w-6'
            onClick={() => handleMoveImage(fieldName, index, 'up')}
            title='Move up'
          >
            <MoveUp className='h-3 w-3' />
          </Button>
        )}

        {index < totalImages - 1 && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='bg-black/50 text-white hover:bg-black/70 h-6 w-6'
            onClick={() => handleMoveImage(fieldName, index, 'down')}
            title='Move down'
          >
            <MoveDown className='h-3 w-3' />
          </Button>
        )}
      </div>
    );
  };

  console.log(formik.values, 'formik');

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardContent className='pt-6'>
        <form onSubmit={formik.handleSubmit}>
          <h2 className='text-2xl font-bold mb-6 text-center'>
            CTR Optimized Media
          </h2>

          {/* Card Image Section */}
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-4'>
              <FileImage className='h-5 w-5 text-primary' />
              <h3 className='text-xl font-semibold'>Card Images</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='h-4 w-4 text-muted-foreground cursor-help ml-1' />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-xs'>
                    Card images are used as thumbnails in listings and search
                    results, directly impacting Click-Through Rates.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className='grid gap-6 sm:grid-cols-2'>
              {/* Card Image */}
              <div className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
                <h4 className='font-medium mb-2 flex items-center gap-2'>
                  <Image className='h-4 w-4' />
                  Horizontal Card Image
                </h4>
                <p className='text-sm text-gray-500 mb-4'>
                  This image will be used for event cards and search results
                  (Recommended: 600x400px)
                </p>

                {formik.values.eventcardImage ? (
                  <div className='relative mb-4 group'>
                    <img
                      src={getImageUrl(formik.values.eventcardImage)}
                      alt='Card Preview'
                      className='w-full h-40 object-cover rounded border'
                    />
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='mr-2 bg-white'
                        onClick={() =>
                          openImagePreview(
                            formik.values.eventcardImage as File | string
                          )
                        }
                      >
                        Preview
                      </Button>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() => handleRemoveFile('eventcardImage')}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='border border-dashed rounded-lg flex flex-col items-center justify-center h-40 mb-4 bg-white'>
                    <FileImage className='h-8 w-8 text-gray-400 mb-2' />
                    <p className='text-sm text-gray-500'>No image selected</p>
                  </div>
                )}

                <div>
                  <Label
                    htmlFor='eventcardImage'
                    className='cursor-pointer w-full'
                  >
                    <div className='flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors'>
                      <Upload className='h-4 w-4' />
                      <span>
                        {formik.values.eventcardImage
                          ? 'Change Image'
                          : 'Upload Image'}
                      </span>
                    </div>
                    <Input
                      id='eventcardImage'
                      name='eventcardImage'
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) => handleFileChange(e, 'eventcardImage')}
                    />
                  </Label>
                </div>
              </div>

              {/* Vertical Card Image */}
              <div className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
                <h4 className='font-medium mb-2 flex items-center gap-2'>
                  <Image className='h-4 w-4' />
                  Vertical Card Image
                </h4>
                <p className='text-sm text-gray-500 mb-4'>
                  Optimized for mobile feeds and portrait displays (Recommended:
                  400x600px).
                </p>

                {formik.values.eventVerticalCardImage ? (
                  <div className='relative mb-4 group'>
                    <img
                      src={getImageUrl(formik.values.eventVerticalCardImage)}
                      alt='Vertical Card Preview'
                      className='w-full h-40 object-contain rounded border'
                    />
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='mr-2 bg-white'
                        onClick={() =>
                          openImagePreview(
                            formik.values.eventVerticalCardImage as
                              | File
                              | string
                          )
                        }
                      >
                        Preview
                      </Button>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={() =>
                          handleRemoveFile('eventVerticalCardImage')
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='border border-dashed rounded-lg flex flex-col items-center justify-center h-40 mb-4 bg-white'>
                    <FileImage className='h-8 w-8 text-gray-400 mb-2' />
                    <p className='text-sm text-gray-500'>No image selected</p>
                  </div>
                )}

                <div>
                  <Label
                    htmlFor='eventVerticalCardImage'
                    className='cursor-pointer w-full'
                  >
                    <div className='flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors'>
                      <Upload className='h-4 w-4' />
                      <span>
                        {formik.values.eventVerticalCardImage
                          ? 'Change Image'
                          : 'Upload Image'}
                      </span>
                    </div>
                    <Input
                      id='eventVerticalCardImage'
                      name='eventVerticalCardImage'
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) =>
                        handleFileChange(e, 'eventVerticalCardImage')
                      }
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Images Section */}
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-4'>
              <GalleryHorizontal className='h-5 w-5 text-primary' />
              <h3 className='text-xl font-semibold'>Banner Images</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='h-4 w-4 text-muted-foreground cursor-help ml-1' />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-xs'>
                    Banner images create visual interest at the top of your
                    content, significantly improving engagement metrics and time
                    on page.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className='grid gap-6 sm:grid-cols-1'>
              {/* Horizontal Banner Images */}
              <div className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
                <h4 className='font-medium mb-2 flex items-center gap-2'>
                  <GalleryHorizontal className='h-4 w-4' />
                  Horizontal Banners
                </h4>
                <p className='text-sm text-gray-500 mb-4'>
                  Add multiple horizontal banner images for desktop view
                  (Recommended: 1200x300px). Carousels of multiple banners can
                  increase engagement by 40%.
                </p>

                {formik.values.eventBannerImage.length > 0 ? (
                  <div className='mb-4'>
                    <ScrollArea className='h-64 w-full rounded border bg-white p-2'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-2'>
                        {formik.values.eventBannerImage.map((image, index) => (
                          <div
                            key={index}
                            className='relative group rounded-md overflow-hidden border'
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={`Banner Image ${index + 1}`}
                              className='w-full h-40 object-cover'
                            />
                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                className='mr-2 bg-white'
                                onClick={() => openImagePreview(image)}
                              >
                                Preview
                              </Button>
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                onClick={() =>
                                  handleRemoveFile('eventBannerImage', index)
                                }
                              >
                                Remove
                              </Button>
                            </div>
                            {renderReorderButtons(
                              'eventBannerImage',
                              index,
                              formik.values.eventBannerImage.length
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className='border border-dashed rounded-lg flex flex-col items-center justify-center h-32 mb-4 bg-white'>
                    <GalleryHorizontal className='h-8 w-8 text-gray-400 mb-2' />
                    <p className='text-sm text-gray-500'>
                      No banner images selected
                    </p>
                  </div>
                )}

                <div>
                  <Label
                    htmlFor='eventBannerImage'
                    className='cursor-pointer w-full'
                  >
                    <div className='flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors'>
                      <Upload className='h-4 w-4' />
                      <span>Add Banner Images</span>
                    </div>
                    <Input
                      id='eventBannerImage'
                      name='eventBannerImage'
                      type='file'
                      accept='image/*'
                      multiple
                      className='hidden'
                      onChange={(e) =>
                        handleFileChange(e, 'eventBannerImage', true)
                      }
                    />
                  </Label>
                </div>
              </div>

              {/* Vertical Banner Images */}
              <div className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
                <h4 className='font-medium mb-2 flex items-center gap-2'>
                  <GalleryHorizontal className='h-4 w-4' />
                  Vertical Banners
                </h4>
                <p className='text-sm text-gray-500 mb-4'>
                  Multiple vertical banners for mobile view (Recommended:
                  800x1200px). Mobile-optimized banners improve mobile
                  conversion rates by up to 30%.
                </p>

                {formik.values.eventVerticalBannerImage.length > 0 ? (
                  <div className='mb-4'>
                    <ScrollArea className='h-64 w-full rounded border bg-white p-2'>
                      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 p-2'>
                        {formik.values.eventVerticalBannerImage.map(
                          (image, index) => (
                            <div
                              key={index}
                              className='relative group rounded-md overflow-hidden border'
                            >
                              <img
                                src={getImageUrl(image)}
                                alt={`Vertical Banner Image ${index + 1}`}
                                className='w-full h-40 object-contain'
                              />
                              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  className='mr-2 bg-white'
                                  onClick={() => openImagePreview(image)}
                                >
                                  Preview
                                </Button>
                                <Button
                                  type='button'
                                  variant='destructive'
                                  size='sm'
                                  onClick={() =>
                                    handleRemoveFile(
                                      'eventVerticalBannerImage',
                                      index
                                    )
                                  }
                                >
                                  Remove
                                </Button>
                              </div>
                              {renderReorderButtons(
                                'eventVerticalBannerImage',
                                index,
                                formik.values.eventVerticalBannerImage.length
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className='border border-dashed rounded-lg flex flex-col items-center justify-center h-32 mb-4 bg-white'>
                    <GalleryHorizontal className='h-8 w-8 text-gray-400 mb-2' />
                    <p className='text-sm text-gray-500'>
                      No vertical banner images selected
                    </p>
                  </div>
                )}

                <div>
                  <Label
                    htmlFor='eventVerticalBannerImage'
                    className='cursor-pointer w-full'
                  >
                    <div className='flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors'>
                      <Upload className='h-4 w-4' />
                      <span>Add Vertical Banner Images</span>
                    </div>
                    <Input
                      id='eventVerticalBannerImage'
                      name='eventVerticalBannerImage'
                      type='file'
                      accept='image/*'
                      multiple
                      className='hidden'
                      onChange={(e) =>
                        handleFileChange(e, 'eventVerticalBannerImage', true)
                      }
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Images Section */}
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-4'>
              <GalleryHorizontal className='h-5 w-5 text-primary' />
              <h3 className='text-xl font-semibold'>Gallery Images</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='h-4 w-4 text-muted-foreground cursor-help ml-1' />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-xs'>
                    Gallery images keep visitors engaged longer, reducing bounce
                    rates and increasing conversion probability.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
              <p className='text-sm text-gray-500 mb-4'>
                Add multiple gallery images to increase engagement time by up to
                40% and improve conversion rates. Users who view galleries have
                3x higher CTR on CTA buttons.
              </p>

              {formik.values.galleryImages.length > 0 ? (
                <div className='mb-4'>
                  <ScrollArea className='h-64 w-full rounded border bg-white p-2'>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 p-2'>
                      {formik.values.galleryImages.map((image, index) => (
                        <div
                          key={index}
                          className='relative group rounded-md overflow-hidden border'
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`Gallery Image ${index + 1}`}
                            className='w-full h-40 object-contain'
                          />
                          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className='mr-2 bg-white'
                              onClick={() => openImagePreview(image)}
                            >
                              Preview
                            </Button>
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              onClick={() =>
                                handleRemoveFile('galleryImages', index)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                          {renderReorderButtons(
                            'galleryImages',
                            index,
                            formik.values.galleryImages.length
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className='border border-dashed rounded-lg flex flex-col items-center justify-center h-40 mb-4 bg-white'>
                  <GalleryHorizontal className='h-8 w-8 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>
                    No gallery images selected
                  </p>
                </div>
              )}

              <div>
                <Label
                  htmlFor='galleryImages'
                  className='cursor-pointer w-full'
                >
                  <div className='flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors'>
                    <Upload className='h-4 w-4' />
                    <span>Add Gallery Images</span>
                  </div>
                  <Input
                    id='galleryImages'
                    name='galleryImages'
                    type='file'
                    accept='image/*'
                    multiple
                    className='hidden'
                    onChange={(e) => handleFileChange(e, 'galleryImages', true)}
                  />
                </Label>
              </div>
            </div>
          </div>

          {/* Video Content Section */}
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-4'>
              <Video className='h-5 w-5 text-primary' />
              <h3 className='text-xl font-semibold'>Video Content</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='h-4 w-4 text-muted-foreground cursor-help ml-1' />
                  </TooltipTrigger>
                  <TooltipContent className='max-w-xs'>
                    Video content increases engagement by 80% and can boost
                    conversion rates by up to 86% compared to static content.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
              <div className='grid gap-6 sm:grid-cols-2'>
                {/* YouTube Video Link */}
                <div>
                  <h4 className='font-medium mb-2 flex items-center gap-2'>
                    <Youtube className='h-4 w-4' />
                    YouTube Video
                  </h4>
                  <p className='text-sm text-gray-500 mb-4'>
                    Add a YouTube video to increase engagement time by 2x.
                    YouTube videos are lightweight and don't affect page load
                    speed, maintaining high CTR.
                  </p>

                  <div className='space-y-2'>
                    <Label htmlFor='youtubeLink'>YouTube URL</Label>
                    <Input
                      id='youtubeLink'
                      name='youtubeLink'
                      type='url'
                      placeholder='https://www.youtube.com/watch?v=...'
                      value={formik.values.youtubeLink || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.youtubeLink && formik.errors.youtubeLink
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {formik.touched.youtubeLink &&
                      formik.errors.youtubeLink && (
                        <p className='text-red-500 text-sm'>
                          {formik.errors.youtubeLink}
                        </p>
                      )}
                  </div>

                  {formik.values.youtubeLink && !formik.errors.youtubeLink && (
                    <div className='mt-4 border rounded bg-white p-2'>
                      <p className='text-sm font-medium'>
                        YouTube video added:
                      </p>
                      <div className='flex items-center'>
                        <p className='text-sm text-gray-600 truncate flex-1'>
                          {formik.values.youtubeLink}
                        </p>
                        <Button
                          type='button'
                          size='sm'
                          variant='ghost'
                          onClick={() =>
                            window.open(formik.values.youtubeLink, '_blank')
                          }
                        >
                          <ExternalLink className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video File Upload */}
                <div>
                  <h4 className='font-medium mb-2 flex items-center gap-2'>
                    <Video className='h-4 w-4' />
                    Upload Video
                  </h4>
                  <p className='text-sm text-gray-500 mb-4'>
                    Upload a video file directly (Max size: 100MB). Self-hosted
                    videos provide advanced CTR analytics and full control over
                    playback experience.
                  </p>
                  {formik.values.eventVerticalVideo ? (
                    <div className='relative mb-4'>
                      <video
                        controls
                        src={getVideoSrc(
                          formik.values.eventVerticalVideo as File | string
                        )}
                        className='w-full h-40 object-contain rounded border'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='mt-2'
                        onClick={() => handleRemoveFile('eventVerticalVideo')}
                      >
                        Remove Video
                      </Button>
                    </div>
                  ) : (
                    <div className='border-dashed border rounded-lg flex flex-col items-center justify-center h-40 bg-white'>
                      <Video className='h-8 w-8 text-gray-400 mb-2' />
                      <p className='text-sm text-gray-500'>No video selected</p>
                    </div>
                  )}

                  <div>
                    <Label
                      htmlFor='eventVerticalVideo'
                      className='cursor-pointer w-full'
                    >
                      <div className='flex items-center justify-center gap-2 border rounded-md p-2 bg-white hover:bg-gray-50 transition-colors'>
                        <Upload className='h-4 w-4' />
                        <span>
                          {formik.values.eventVerticalVideo
                            ? 'Change Video'
                            : 'Upload Video'}
                        </span>
                      </div>
                      <Input
                        id='eventVerticalVideo'
                        name='eventVerticalVideo'
                        type='file'
                        accept='video/*'
                        className='hidden'
                        onChange={(e) =>
                          handleFileChange(e, 'eventVerticalVideo')
                        }
                      />
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className='my-6' />

          <div className='flex justify-between mt-6'>
            {onBack && (
              <Button type='button' variant='outline' onClick={onBack}>
                Back
              </Button>
            )}
            <Button type='submit' className='ml-auto'>
              Save Media
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'
          onClick={() => setPreviewImage(null)}
        >
          <div className='relative max-w-4xl max-h-[90vh] p-2'>
            <Button
              variant='outline'
              size='icon'
              className='absolute top-4 right-4 bg-black/30 text-white hover:bg-black/50 hover:text-white border-none'
              onClick={() => setPreviewImage(null)}
            >
              <X className='h-4 w-4' />
            </Button>
            <img
              src={previewImage}
              alt='Preview'
              className='max-w-full max-h-[90vh] object-contain'
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export { MediaStep };
