'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import RightCaret from '@/components/icons/RightCaret';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type FormData = {
  name: string;
  email: string;
  company?: string;
  interests: string[];
};

const interestOptions = [
  { id: 'developer', label: 'Developer' },
  { id: 'business', label: 'Business Owner' },
  { id: 'investor', label: 'Investor' },
  { id: 'partner', label: 'Potential Partner' },
];

type WaitlistDialogProps = {
  trigger?: React.ReactNode;
  buttonText?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function WaitlistDialog({
  trigger,
  buttonText = "Join the Waitlist",
  isOpen,
  onOpenChange
}: WaitlistDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    interests: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);

  // Determine if we're using controlled or uncontrolled dialog
  const isControlled = isOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interestId: string) => {
    setFormData((prev) => {
      if (prev.interests.includes(interestId)) {
        return {
          ...prev,
          interests: prev.interests.filter((id) => id !== interestId),
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interestId],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form (client-side)
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Submit to API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          interests: formData.interests,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit. Please try again.');
      }

      // Set success state
      setIsSuccess(true);

      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false);
        // Reset form after dialog is closed
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            interests: [],
          });
        }, 300);
      }, 2000);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-hauora">Join the Formation Waitlist</DialogTitle>
              <DialogDescription>
                Sign up to be notified when Formation launches.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-formation-blue focus:border-formation-blue"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-formation-blue focus:border-formation-blue"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-formation-blue focus:border-formation-blue"
                />
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  I am interested as a: (Select all that apply)
                </span>
                <div className="space-y-2">
                  {interestOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(option.id)}
                        onChange={() => handleInterestChange(option.id)}
                        className="h-4 w-4 text-formation-blue focus:ring-formation-blue border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full button-with-gradient"
                >
                  {isSubmitting ? 'Submitting...' : buttonText} <RightCaret />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-500 text-center">
              You've been added to our waitlist. We'll notify you when Formation is ready for you.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
