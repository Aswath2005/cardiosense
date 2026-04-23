'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import PredictSection from '@/components/PredictSection';
import ResultsSection from '@/components/ResultsSection';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useMockAuth } from '@/lib/mockAuth';

export default function Home() {
  const router = useRouter();
  const mockAuth = useMockAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [skipAuth, setSkipAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for skip auth in query params (for testing)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          if (params.get('skipAuth') === 'true') {
            console.log('🧪 Skipping login for testing...');
            setSkipAuth(true);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }

        // Wait for mock auth to initialize from localStorage
        if (mockAuth.isLoading) {
          // Still loading, don't redirect yet
          return;
        }

        // Check for mock auth first (if network is down)
        if (mockAuth.user) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Try to check Supabase session
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.warn('Supabase auth error:', error);
            setIsLoading(false);
            router.push('/login');
            return;
          }
          
          if (session?.user) {
            // Authenticated - show home page
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        } catch (supabaseError) {
          console.error('Supabase session check failed:', supabaseError);
        }
        
        // Not authenticated - redirect to login
        setIsLoading(false);
        router.push('/login');
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, mockAuth.user, mockAuth.isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Show page if authenticated OR if skipAuth is enabled
  if (!isAuthenticated && !skipAuth) {
    return null;
  }

  return (
    <main className="min-h-screen bg-bg-main">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PredictSection />
      <ResultsSection />
      <Footer />
    </main>
  );
}
