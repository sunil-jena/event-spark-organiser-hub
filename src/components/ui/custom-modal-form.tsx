
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Switch } from './switch';
import { Label } from './label';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'date' | 'email' | 'password' | 'switch' | 'file';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  helperText?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  width?: 'full' | 'half' | 'third';
  step?: number;
  accept?: string;
}

export interface CustomModalFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  trigger?: React.ReactNode;
  loading?: boolean;
  defaultOpen?: boolean;
  onCancel?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const CustomModalForm: React.FC<CustomModalFormProps> = ({
  title,
  description,
  fields,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  width = 'md',
  trigger,
  loading = false,
  defaultOpen = false,
  onCancel,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      }
    });
    setFormData(initialData);
  }, [fields]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open === false) {
      // Reset form on close
      setErrors({});
      setIsSubmitting(false);
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error for this field when user makes changes
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        
        if (value === undefined || value === null || value === '') {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
      
      if (field.type === 'number' && formData[field.id] !== undefined && formData[field.id] !== '') {
        const value = Number(formData[field.id]);
        
        if (field.min !== undefined && value < field.min) {
          newErrors[field.id] = `Must be at least ${field.min}`;
        }
        
        if (field.max !== undefined && value > field.max) {
          newErrors[field.id] = `Must be at most ${field.max}`;
        }
      }
      
      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setIsSubmitting(false);
      handleOpenChange(false);
      toast({
        title: "Success",
        description: "Form submitted successfully!",
      });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleOpenChange(false);
  };

  const getWidthClass = (width: FormField['width']) => {
    switch (width) {
      case 'half':
        return 'sm:col-span-1';
      case 'third':
        return 'sm:col-span-1 md:col-span-1';
      case 'full':
      default:
        return 'sm:col-span-2';
    }
  };

  const getDialogWidth = () => {
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
      case '3xl':
        return 'max-w-3xl';
      case '4xl':
        return 'max-w-4xl';
      case '5xl':
        return 'max-w-5xl';
      default:
        return 'max-w-md';
    }
  };

  const renderField = (field: FormField) => {
    const { id, label, type, placeholder, required, options, helperText, disabled, min, max, step, accept } = field;
    const error = errors[id];

    switch (type) {
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={id}
              value={formData[id] || ''}
              onChange={(e) => handleChange(id, e.target.value)}
              placeholder={placeholder}
              disabled={disabled || isSubmitting}
              className={error ? 'border-red-500' : ''}
            />
            {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={formData[id] || ''}
              onValueChange={(value) => handleChange(id, value)}
              disabled={disabled || isSubmitting}
            >
              <SelectTrigger id={id} className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      case 'switch':
        return (
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor={id} className="flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
              </Label>
              {helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
            </div>
            <Switch
              id={id}
              checked={!!formData[id]}
              onCheckedChange={(checked) => handleChange(id, checked)}
              disabled={disabled || isSubmitting}
            />
          </div>
        );
        
      case 'file':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleChange(id, file);
              }}
              disabled={disabled || isSubmitting}
              accept={accept}
              className={error ? 'border-red-500' : ''}
            />
            {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
        
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={id}
              type={type}
              value={formData[id] || ''}
              onChange={(e) => handleChange(id, type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={placeholder}
              disabled={disabled || isSubmitting}
              min={min}
              max={max}
              step={step}
              className={error ? 'border-red-500' : ''}
            />
            {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className={`${getDialogWidth()} p-0 overflow-hidden`}>
        <div className="flex flex-col max-h-[85vh]">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle>{title}</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancel}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {description && <DialogDescription className="mt-1.5">{description}</DialogDescription>}
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(field => (
                  <div 
                    key={field.id} 
                    className={getWidthClass(field.width)}
                  >
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter className="p-6 pt-0">
              <div className="flex gap-2 w-full justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {cancelText}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? "Processing..." : submitText}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
