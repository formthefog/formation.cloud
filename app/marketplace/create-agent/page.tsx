'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AgentSubmission, DeploymentSource } from './types';
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
  CloudIcon,
  ServerIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
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
    name: '',
    description: '',
    deploymentSource: 'github',
    repositoryUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on deployment source
    let error = '';
    switch (formData.deploymentSource) {
      case 'github':
        if (!formData.repositoryUrl) error = 'Please enter a GitHub repository URL';
        break;
      case 'docker-registry':
        if (!formData.dockerRegistryUrl) error = 'Please enter a Docker registry URL';
        break;
      case 'docker-compose':
        if (!formData.dockerComposeContent) error = 'Please provide Docker Compose content';
        break;
    }

    if (error) {
      toast.error(error);
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

  const renderDeploymentSourceInput = () => {
    switch (formData.deploymentSource) {
      case 'github':
        return (
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
        );
      case 'docker-registry':
        return (
          <div>
            <label htmlFor="dockerRegistryUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Docker Registry URL*
            </label>
            <Input
              id="dockerRegistryUrl"
              type="url"
              placeholder="https://registry.hub.docker.com/r/username/image"
              value={formData.dockerRegistryUrl}
              onChange={(e) => setFormData({ ...formData, dockerRegistryUrl: e.target.value })}
              required
              className="w-full"
            />
            <p className="mt-2 text-sm text-gray-500">
              Provide the URL to your Docker image in a registry (e.g., Docker Hub, GitHub Container Registry).
            </p>
          </div>
        );
      case 'docker-compose':
        return (
          <div>
            <label htmlFor="dockerComposeContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Docker Compose Configuration*
            </label>
            <Textarea
              id="dockerComposeContent"
              placeholder="version: '3.8'
services:
  app:
    image: your-image:tag
    ..."
              value={formData.dockerComposeContent}
              onChange={(e) => setFormData({ ...formData, dockerComposeContent: e.target.value })}
              required
              className="w-full h-64 font-mono"
            />
            <p className="mt-2 text-sm text-gray-500">
              Paste your docker-compose.yml configuration here. We'll use this to deploy your agent.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Deployment Source Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Deployment Source*
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deploymentSource: 'github' })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.deploymentSource === 'github'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                    }`}
                  >
                    <CodeBracketIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <h3 className="font-medium">GitHub Repository</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Deploy from a Git repository
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deploymentSource: 'docker-registry' })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.deploymentSource === 'docker-registry'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                    }`}
                  >
                    <CloudIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <h3 className="font-medium">Docker Registry</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Use a pre-built Docker image
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deploymentSource: 'docker-compose' })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.deploymentSource === 'docker-compose'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                    }`}
                  >
                    <ServerIcon className="h-6 w-6 text-blue-500 mb-2" />
                    <h3 className="font-medium">Docker Compose</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Multi-container deployment
                    </p>
                  </button>
                </div>
              </div>

              {/* Deployment Source Input */}
              {renderDeploymentSourceInput()}

              {/* Name and Description fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agent Name*
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My Awesome Agent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full"
                />
                <p className="mt-2 text-sm text-gray-500">
                  A clear, descriptive name for your agent. This can be changed later.
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description*
                </label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what your agent does..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full h-32"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Help users understand what your agent does and how it can help them.
                </p>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.description}
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