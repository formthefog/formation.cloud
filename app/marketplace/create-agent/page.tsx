'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AgentSubmission } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ChatBubbleBottomCenterTextIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'Submit Repository',
    description: 'Share your GitHub repository with us',
    icon: CodeBracketIcon,
  },
  {
    title: 'Manual Review',
    description: 'Our team reviews your agent',
    icon: BeakerIcon,
  },
  {
    title: 'Integration',
    description: 'We add your agent to the network',
    icon: ArrowPathIcon,
  },
  {
    title: 'Go Live',
    description: 'Your agent is ready to use',
    icon: CheckCircleIcon,
  },
];

export default function CreateAgentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AgentSubmission>({
    repositoryUrl: '',
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.repositoryUrl) {
      toast.error('Please enter a GitHub repository URL');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Here we would make an API call to submit the agent
      // For now, we'll just simulate a success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Agent submitted successfully! We will review and add it to the network.');
      router.push('/marketplace/command-center');
    } catch (error) {
      console.error('Error submitting agent:', error);
      toast.error('Failed to submit agent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Submit Your Agent to Formation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We're currently in beta and manually reviewing all agent submissions to ensure quality and security.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 dark:bg-blue-800 transform -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Beta Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mb-12">
          <div className="flex items-start">
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-blue-500 dark:text-blue-400 mt-1 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Manual Review Process During Beta
              </h3>
              <p className="text-blue-800 dark:text-blue-200">
                While we're in beta, our team personally reviews each submission to ensure it meets our standards and works seamlessly with our network. This process typically takes 1-2 business days. We'll keep you updated on the progress via email.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="repositoryUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GitHub Repository URL*
                </label>
                <Input
                  id="repositoryUrl"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={formData.repositoryUrl}
                  onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                  required
                  className="w-full"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Please provide the full URL to your GitHub repository. Make sure it's public or you've granted us access.
                </p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agent Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My Awesome Agent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full"
                />
                <p className="mt-2 text-sm text-gray-500">
                  A clear, descriptive name for your agent. This can be changed later.
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what your agent does..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-32"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Help users understand what your agent does and how it can help them.
                </p>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.repositoryUrl}
                  className="w-full h-12 text-lg relative overflow-hidden group"
                >
                  <span className={`absolute inset-0 w-full h-full transition-all duration-300 ease-out transform ${isSubmitting ? 'translate-y-0' : 'translate-y-full'} bg-blue-600 group-hover:translate-y-0`}></span>
                  <span className="relative group-hover:text-white transition-colors duration-300">
                    {isSubmitting ? 'Submitting...' : 'Submit Agent for Review'}
                  </span>
                </Button>
                <p className="mt-4 text-sm text-center text-gray-500">
                  <ClockIcon className="inline-block w-4 h-4 mr-1 -mt-1" />
                  Review process typically takes 1-2 business days
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 