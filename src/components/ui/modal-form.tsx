import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ModalFormProps {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (event: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function ModalForm({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  children,
  loading = false,
  size = 'md',
}: ModalFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  const getMaxWidthClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case 'full':
        return 'max-w-[95vw]';
      default:
        return 'max-w-md';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${getMaxWidthClass()} overflow-y-auto max-h-[90vh]`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='py-4'>{children}</div>

          <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                {cancelLabel}
              </Button>
            </DialogClose>
            <Button type='submit' disabled={loading}>
              {loading ? 'Loading...' : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
