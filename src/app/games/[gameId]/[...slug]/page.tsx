'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function GamePage({ params }: { params: { gameId: string; slug: string[] } }) {
  const router = useRouter();
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/games/${params.gameId}/${params.slug?.join('/') || ''}`);
        if (!response.ok) throw new Error('Failed to fetch game data');
        
        const html = await response.text();
        // Extract redirect URL from meta tags if needed
        window.location.href = `https://www.roblox.com/games/${params.gameId}`;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process game URL",
        });
        router.push('/');
      }
    };

    fetchAndRedirect();
  }, [params, router, toast, API_BASE_URL]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Redirecting to Roblox...</div>
    </div>
  );
} 