import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { AdditionalInfoFormValues, COMMON_PROHIBITED_ITEMS } from './types';
import { RichTextEditor } from './RichTextEditor';
import { ProhibitedItemsSection } from './ProhibitedItemsSection';
import { SponsorSection } from './SponsorSectionProps';

// Use 'export type' for re-exporting types when isolatedModules is enabled

const AdditionalInfoSchema = Yup.object().shape({
  termsAndConditions: Yup.string(),
  prohibitedItems: Yup.array().of(Yup.string()),
  sponsors: Yup.array().of(
    Yup.object().shape({
      brandName: Yup.string().required(),
      brandLogo: Yup.string().required(),
      priority: Yup.number().required(),
    })
  ),
  faqItems: Yup.array().of(
    Yup.object().shape({
      question: Yup.string(),
      answer: Yup.string(),
    })
  ),
});

interface AdditionalInfoStepProps {
  additionalInfo: AdditionalInfoFormValues;
  onSubmit: (additionalInfo: AdditionalInfoFormValues) => void;
  onBack: () => void;
}

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  additionalInfo,
  onSubmit,
  onBack,
}) => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      ...additionalInfo,
      faqItems: additionalInfo.faqItems || [{ question: '', answer: '' }],
    },
    validationSchema: AdditionalInfoSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const addFaqItem = () => {
    const faqItems = [
      ...(formik.values.faqItems || []),
      { question: '', answer: '' },
    ];
    formik.setFieldValue('faqItems', faqItems);
  };

  const removeFaqItem = (index: number) => {
    const faqItems = [...formik.values.faqItems];
    faqItems.splice(index, 1);
    formik.setFieldValue('faqItems', faqItems);
  };

  const handleFaqChange = (
    index: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    const newFaqItems = [...formik.values.faqItems];
    newFaqItems[index][field] = value;
    formik.setFieldValue('faqItems', newFaqItems);
  };

  return (
    <Card className='shadow-lg border-[#24005b]/10'>
      <CardContent className='pt-6'>
        <form onSubmit={formik.handleSubmit} className='space-y-8'>
          <h2 className='text-2xl font-semibold mb-6 text-[#24005b]'>
            Additional Information
          </h2>

          <div className='space-y-8'>
            {/* Terms and Conditions with Rich Text Editor */}
            <div className='space-y-3'>
              <Label
                htmlFor='termsAndConditions'
                className='text-lg font-medium'
              >
                Terms & Conditions
              </Label>
              <p className='text-sm text-gray-500'>
                Add all terms, FAQs, event rules, and refund policies in one
                place.
              </p>
              <RichTextEditor
                value={formik.values.termsAndConditions || ''}
                onChange={(content) =>
                  formik.setFieldValue('termsAndConditions', content)
                }
                placeholder='Enter all your terms and conditions, FAQ, refund policies, and event rules here...'
              />
            </div>

            {/* FAQ Section */}
            <Collapsible
              open={isFaqOpen}
              onOpenChange={setIsFaqOpen}
              className='border rounded-md p-4'
            >
              <CollapsibleTrigger className='flex items-center justify-between w-full'>
                <h3 className='text-lg font-medium'>
                  Frequently Asked Questions
                </h3>
                {isFaqOpen ? 'Hide' : 'Show'} FAQ Editor
              </CollapsibleTrigger>
              <CollapsibleContent className='pt-4 space-y-4'>
                <p className='text-sm text-gray-500'>
                  Add frequently asked questions that will appear in a dedicated
                  section.
                </p>
                {formik.values.faqItems &&
                  formik.values.faqItems.map((faq, index) => (
                    <div
                      key={index}
                      className='space-y-3 p-3 border rounded-md'
                    >
                      <div className='flex justify-between items-center'>
                        <h4 className='font-medium'>FAQ Item #{index + 1}</h4>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeFaqItem(index)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor={`question-${index}`}>Question</Label>
                        <Input
                          id={`question-${index}`}
                          value={faq.question}
                          onChange={(e) =>
                            handleFaqChange(index, 'question', e.target.value)
                          }
                          placeholder='Enter question...'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor={`answer-${index}`}>Answer</Label>
                        <Textarea
                          id={`answer-${index}`}
                          value={faq.answer}
                          onChange={(e) =>
                            handleFaqChange(index, 'answer', e.target.value)
                          }
                          placeholder='Enter answer...'
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                <Button
                  type='button'
                  onClick={addFaqItem}
                  variant='outline'
                  className='w-full flex items-center justify-center mt-3'
                >
                  <Plus className='h-4 w-4 mr-2' /> Add FAQ Item
                </Button>

                {/* FAQ Preview */}
                {formik.values.faqItems.filter(
                  (item) => item.question && item.answer
                ).length > 0 && (
                  <div className='mt-6 border-t pt-4'>
                    <h3 className='text-lg font-medium mb-3'>FAQ Preview</h3>
                    <div className='space-y-3'>
                      {formik.values.faqItems
                        .filter((item) => item.question && item.answer)
                        .map((faq, index) => (
                          <div key={index} className='border rounded-md p-3'>
                            <h4 className='font-medium'>{faq.question}</h4>
                            <p className='text-muted-foreground text-sm mt-1'>
                              {faq.answer}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {/* Prohibited Items Section */}
            <ProhibitedItemsSection
              selectedItems={formik.values.prohibitedItems || []}
              onChange={(items) =>
                formik.setFieldValue('prohibitedItems', items)
              }
              prohibitedItems={COMMON_PROHIBITED_ITEMS}
            />

            {/* Sponsor Section */}
            <SponsorSection
              sponsors={formik.values.sponsors || []}
              onChange={(sponsors) =>
                formik.setFieldValue('sponsors', sponsors)
              }
            />
          </div>

          <div className='flex justify-between mt-8 pt-4 border-t'>
            <Button
              type='button'
              variant='outline'
              onClick={onBack}
              className='border-[#24005b] text-[#24005b] hover:bg-[#24005b]/5'
            >
              Back
            </Button>
            <Button
              type='submit'
              className='flex items-center bg-[#24005b] hover:bg-[#36127d] text-white'
              disabled={formik.isSubmitting}
            >
              Next: Review <ChevronRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
