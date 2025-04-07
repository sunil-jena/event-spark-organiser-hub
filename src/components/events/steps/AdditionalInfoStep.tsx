
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface AdditionalInfoFormValues {
  eventRules?: string;
  faq?: string;
  terms?: string;
  refundPolicy?: string;
}

interface AdditionalInfoStepProps {
  additionalInfo: AdditionalInfoFormValues;
  onSubmit: (additionalInfo: AdditionalInfoFormValues) => void;
  onBack: () => void;
}

export const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({ 
  additionalInfo, 
  onSubmit, 
  onBack 
}) => {
  const [formData, setFormData] = useState<AdditionalInfoFormValues>(additionalInfo);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        
        <div className="space-y-6">
          <Accordion type="single" collapsible defaultValue="eventRules">
            <AccordionItem value="eventRules">
              <AccordionTrigger className="text-base font-medium">Event Rules & Guidelines</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="eventRules">Provide any rules or guidelines for attendees</Label>
                  <Textarea
                    id="eventRules"
                    value={formData.eventRules || ''}
                    onChange={(e) => setFormData({...formData, eventRules: e.target.value})}
                    placeholder="Enter event rules and guidelines..."
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    Specify any rules, requirements, age restrictions, prohibited items, or guidelines attendees should know about.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="faq">
              <AccordionTrigger className="text-base font-medium">Frequently Asked Questions</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="faq">Add frequently asked questions</Label>
                  <Textarea
                    id="faq"
                    value={formData.faq || ''}
                    onChange={(e) => setFormData({...formData, faq: e.target.value})}
                    placeholder="Enter FAQ content..."
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    Add common questions and answers in a clear format. For example:<br />
                    Q: Is parking available?<br />
                    A: Yes, free parking is available at the venue.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="terms">
              <AccordionTrigger className="text-base font-medium">Terms & Conditions</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="terms">Add your terms and conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms || ''}
                    onChange={(e) => setFormData({...formData, terms: e.target.value})}
                    placeholder="Enter terms and conditions..."
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    Specify the legal terms and conditions attendees must agree to when purchasing tickets.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="refundPolicy">
              <AccordionTrigger className="text-base font-medium">Refund Policy</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="refundPolicy">Specify your refund policy</Label>
                  <Textarea
                    id="refundPolicy"
                    value={formData.refundPolicy || ''}
                    onChange={(e) => setFormData({...formData, refundPolicy: e.target.value})}
                    placeholder="Enter refund policy..."
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    Clearly state your policies for refunds, exchanges, and cancellations.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

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
            Next: Review <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
