export const validateYoutubeUrl = (url: string): boolean => {
  if (!url) return true;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};

export const isValidImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const isValidVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const getImageUrl = (image: File | string | null): string => {
  if (!image) return '';

  if (typeof image === 'string') {
    return image;
  }

  return URL.createObjectURL(image);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// New functions for handling image reordering
export const moveImagePosition = <T>(
  images: T[],
  fromIndex: number,
  toIndex: number
): T[] => {
  if (
    fromIndex < 0 ||
    fromIndex >= images.length ||
    toIndex < 0 ||
    toIndex >= images.length ||
    fromIndex === toIndex
  ) {
    return images;
  }

  const result = [...images];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);

  return result;
};
