'use client';

import Navigation from '@/components/Navigation';

export default function TutorialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {children}
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-500">
              Have questions? Visit our{' '}
              <a href="/docs" className="text-formation-blue hover:text-formation-blue/90 font-medium">
                documentation
              </a>
              {' '}or join our{' '}
              <a href="/community" className="text-formation-blue hover:text-formation-blue/90 font-medium">
                community
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 