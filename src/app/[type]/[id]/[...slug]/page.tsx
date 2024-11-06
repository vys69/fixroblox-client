 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const VALID_ROBLOX_PATHS = {
  'games': /^\d+$/,
  'game': /^\d+$/,
  'groups': /^\d+$/,
  'users': /^\d+$/,
};

export default function DynamicRoute({ params }: { params: { type: string; id: string; slug: string[] } }) {
  const router = useRouter();
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const validateAndRedirect = async () => {
      const { type, id } = params;
      const validationType = VALID_ROBLOX_PATHS[type as keyof typeof VALID_ROBLOX_PATHS];

      if (!validationType || !validationType.test(id)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid URL format",
        });
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/${type}/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        window.location.href = data.url;
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process URL",
        });
        router.push('/');
      }
    };

    validateAndRedirect();
  }, [params, router, toast, API_BASE_URL]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Redirecting...</div>
    </div>
  );
}