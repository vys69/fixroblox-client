 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

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
        window.location.href = `https://www.roblox.com/users/${params.userId}/profile`;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process user profile URL",
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