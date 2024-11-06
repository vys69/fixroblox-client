'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import Head from 'next/head';

interface MetaTags {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${params.userId}/profile`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const html = await response.text();
        
        // Parse meta tags
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const metaTags: MetaTags = {
          title: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
          description: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
          image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
          url: doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || ''
        };

        // Add meta tags to document head
        document.title = metaTags.title;
        updateMetaTag('og:title', metaTags.title);
        updateMetaTag('og:description', metaTags.description);
        updateMetaTag('og:image', metaTags.image);
        updateMetaTag('og:url', metaTags.url);
        
        // Delay redirect to allow crawlers to see meta tags
        setTimeout(() => {
          window.location.href = `https://www.roblox.com/users/${params.userId}/profile`;
        }, 500);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process user profile URL",
        });
        router.push('/');
      }
    };

    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    fetchAndRedirect();
  }, [params, router, toast, API_BASE_URL]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Redirecting to Roblox...</div>
    </div>
  );
}