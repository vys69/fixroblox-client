'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

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

export default function DynamicRoute({ params }: Props) {
  const router = useRouter();
  const { toast } = useToast();

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
        window.location.href = `https://www.roblox.com/${type}/${id}`;
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
  }, [params, router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">Redirecting...</div>
    </div>
  );
}