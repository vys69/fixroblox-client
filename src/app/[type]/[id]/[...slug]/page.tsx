'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { parseMetaTags, updateMetaTags } from '@/utils/metaTags';

const VALID_ROBLOX_PATHS = {
  'games': /^\d+$/,
  'game': /^\d+$/,
  'groups': /^\d+$/,
  'users': /^\d+$/,
} as const;

type Props = {
  params: {
    type: keyof typeof VALID_ROBLOX_PATHS;
    id: string;
    slug: string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function DynamicRoute({ params, searchParams }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const validateAndRedirect = async () => {
      const { type, id } = params;
      const validationType = VALID_ROBLOX_PATHS[type];

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
        if (!response.ok) throw new Error('Failed to fetch');
        
        const html = await response.text();
        const metaTags = parseMetaTags(html);
        updateMetaTags(metaTags);
        
        setTimeout(() => {
          window.location.href = `https://www.roblox.com/${type}/${id}`;
        }, 500);
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