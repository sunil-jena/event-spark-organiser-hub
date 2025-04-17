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
import { Input } from './input';
import { Textarea } from './textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Switch } from './switch';
import { Label } from './label';

// Define FieldType to include all supported field types
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'switch'
  | 'file'
  | 'date'
  | 'time'
  | 'datetime'
  | 'checkbox';

// Update FormField type to include all supported properties
export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  accept?: string; // For file inputs
}

export interface CustomModalFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  children?: React.ReactNode;
}

export function CustomModalForm({
  title,
  description,
  fields,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isOpen,
  onOpenChange,
  width = 'md',
  children,
}: CustomModalFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === 'switch') {
        formValues[field.id] = formData.get(field.id) === 'on';
      } else if (field.type === 'file') {
        formValues[field.id] = formData.get(field.id);
      } else {
        formValues[field.id] = formData.get(field.id);
      }
    });

    onSubmit(formValues);
  };

  const getMaxWidthClass = () => {
    switch (width) {
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${getMaxWidthClass()} overflow-y-auto max-h-[90vh]`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {children}

          <div className='py-4'>
            {fields.map((field) => (
              <div key={field.id} className='grid gap-2 mb-4'>
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'text' && (
                  <Input
                    type='text'
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={field.defaultValue}
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={field.defaultValue}
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    type='number'
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={field.defaultValue}
                  />
                )}
                {field.type === 'email' && (
                  <Input
                    type='email'
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={field.defaultValue}
                  />
                )}
                {field.type === 'password' && (
                  <Input
                    type='password'
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={field.defaultValue}
                  />
                )}
                {field.type === 'select' && field.options && (
                  <Select defaultValue={field.defaultValue} name={field.id}>
                    <SelectTrigger id={field.id}>
                      <SelectValue
                        placeholder={field.placeholder || field.label}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === 'switch' && (
                  <div className='flex items-center space-x-2'>
                    <Switch
                      id={field.id}
                      name={field.id}
                      defaultChecked={field.defaultValue}
                    />
                    <Label htmlFor={field.id}>{field.label}</Label>
                  </div>
                )}
                {field.type === 'file' && (
                  <Input
                    type='file'
                    id={field.id}
                    name={field.id}
                    accept={field.accept}
                    required={field.required}
                  />
                )}
                {field.type === 'checkbox' && (
                  <div className='flex items-center space-x-2'>
                    <Input
                      type='checkbox'
                      id={field.id}
                      name={field.id}
                      className='h-4 w-4'
                      defaultChecked={field.defaultValue}
                    />
                    <Label htmlFor={field.id}>{field.label}</Label>
                  </div>
                )}
                {field.helperText && (
                  <p className='text-sm text-muted-foreground'>
                    {field.helperText}
                  </p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                {cancelText}
              </Button>
            </DialogClose>
            <Button type='submit'>{submitText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
