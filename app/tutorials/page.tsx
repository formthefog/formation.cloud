'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaRobot, FaCode, FaLightbulb, FaRocket, FaChartLine } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';

// Tutorial card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Tutorial categories with their respective icons and descriptions
const tutorialCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: FaRocket,
    description: 'Begin your journey with Formation. Learn the basics and set up your first AI agent.',
    color: 'from-blue-500 to-purple-500',
    tutorials: [
      { title: 'Your First AI Agent', duration: '10 min', difficulty: 'Beginner' },
      { title: 'Understanding the Marketplace', duration: '15 min', difficulty: 'Beginner' },
      { title: 'Basic Agent Configuration', duration: '20 min', difficulty: 'Beginner' }
    ]
  },
  {
    id: 'agent-development',
    title: 'Agent Development',
    icon: FaRobot,
    description: 'Master the art of creating sophisticated AI agents with advanced capabilities.',
    color: 'from-green-500 to-teal-500',
    tutorials: [
      { title: 'Advanced Agent Architecture', duration: '30 min', difficulty: 'Advanced' },
      { title: 'Custom Tool Integration', duration: '25 min', difficulty: 'Intermediate' },
      { title: 'Agent Memory Systems', duration: '35 min', difficulty: 'Advanced' }
    ]
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    icon: FaCode,
    description: 'Learn how to integrate Formation agents into your applications using our API.',
    color: 'from-orange-500 to-red-500',
    tutorials: [
      { title: 'REST API Basics', duration: '20 min', difficulty: 'Intermediate' },
      { title: 'WebSocket Integration', duration: '25 min', difficulty: 'Intermediate' },
      { title: 'Authentication & Security', duration: '30 min', difficulty: 'Advanced' }
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    icon: FaLightbulb,
    description: 'Discover industry best practices for AI agent development and deployment.',
    color: 'from-yellow-500 to-orange-500',
    tutorials: [
      { title: 'Agent Design Patterns', duration: '25 min', difficulty: 'Intermediate' },
      { title: 'Performance Optimization', duration: '30 min', difficulty: 'Advanced' },
      { title: 'Security Guidelines', duration: '20 min', difficulty: 'Intermediate' }
    ]
  },
  {
    id: 'monetization',
    title: 'Monetization',
    icon: FaChartLine,
    description: 'Learn how to monetize your agents and build a successful business on Formation.',
    color: 'from-purple-500 to-pink-500',
    tutorials: [
      { title: 'Pricing Strategies', duration: '20 min', difficulty: 'Intermediate' },
      { title: 'Market Analysis', duration: '25 min', difficulty: 'Intermediate' },
      { title: 'Growth Tactics', duration: '30 min', difficulty: 'Advanced' }
    ]
  },
  {
    id: 'certification',
    title: 'Certification',
    icon: FaGraduationCap,
    description: 'Get certified as a Formation AI Agent Developer and showcase your expertise.',
    color: 'from-blue-600 to-blue-800',
    tutorials: [
      { title: 'Certification Prep', duration: '45 min', difficulty: 'Advanced' },
      { title: 'Practice Exams', duration: '60 min', difficulty: 'Advanced' },
      { title: 'Final Assessment', duration: '90 min', difficulty: 'Expert' }
    ]
  }
];

const TutorialCard = ({ category, index }) => {
  const Icon = category.icon;
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${category.color} transition-opacity duration-300`} />
      
      <div className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
            <Icon size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{category.description}</p>
        
        <div className="space-y-4">
          {category.tutorials.map((tutorial, idx) => (
            <Link 
              key={idx}
              href={`/tutorials/${category.id}/${tutorial.title.toLowerCase().replace(/ /g, '-')}`}
              className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{tutorial.title}</h4>
                <span className="text-sm text-gray-500">{tutorial.duration}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tutorial.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  tutorial.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {tutorial.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCategories = tutorialCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.tutorials.some(tutorial => 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Learn to Build with{' '}
              <span className="text-formation-blue">Formation</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Dive into our comprehensive tutorials and become an expert in building, deploying, and monetizing AI agents.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-formation-blue focus:border-formation-blue"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category, index) => (
            <TutorialCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Learning Path Section */}
      <div className="bg-white border-t border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Learning Paths</h2>
            <p className="mt-4 text-lg text-gray-600">
              Follow our curated learning paths to master Formation AI development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beginner Path */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 border border-green-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-green-500 text-white">
                  <FaRocket size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Beginner Path</h3>
                  <p className="text-sm text-gray-600">2-3 weeks</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Formation Basics
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simple Agent Creation
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic Deployment
                </li>
              </ul>
            </div>

            {/* Intermediate Path */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 border border-blue-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-blue-500 text-white">
                  <FaCode size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Intermediate Path</h3>
                  <p className="text-sm text-gray-600">4-6 weeks</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced Agent Features
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API Integration
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom Tools
                </li>
              </ul>
            </div>

            {/* Expert Path */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-8 border border-purple-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-purple-500 text-white">
                  <FaGraduationCap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Expert Path</h3>
                  <p className="text-sm text-gray-600">8-10 weeks</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enterprise Solutions
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced Architecture
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Certification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 