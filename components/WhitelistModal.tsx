'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import RightCaret from './icons/RightCaret';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

const WhitelistForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    interests: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Validate form
      if (!formData.name || !formData.email) {
        throw new Error('Name and email are required');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Submit to Supabase
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            interests: formData.interests,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      // Call onSuccess callback if provided
      onSuccess();

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        interests: [],
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          {isSubmitting ? 'Submitting...' : 'Join the Waitlist'} <RightCaret />
        </Button>
      </div>
    </form>
  );
};

export default WhitelistForm;
