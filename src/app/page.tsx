'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster";
import { Moon, MoonIcon, Sun, Clipboard, ClipboardCopy, Trash } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const VALID_ROBLOX_PATHS = {
  'games': /^\d+$/,
  'game': /^\d+$/,
  'groups': /^\d+$/,
  'users': /^\d+$/,
};

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const { toast } = useToast();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { setTheme } = useTheme()

  const validateRobloxUrl = (url: URL): { isValid: boolean; type?: string; id?: string } => {
    // Check if it's a Roblox domain
    if (!url.hostname.endsWith('roblox.com')) {
      return { isValid: false };
    }

    const pathSegments = url.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2) {
      return { isValid: false };
    }

    const [type, id] = pathSegments;
    const validationType = VALID_ROBLOX_PATHS[type as keyof typeof VALID_ROBLOX_PATHS];

    if (!validationType || !validationType.test(id)) {
      return { isValid: false };
    }

    return { isValid: true, type, id };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = new URL(inputUrl);
      const validation = validateRobloxUrl(url);

      if (validation.isValid && validation.type && validation.id) {
        const fixedUrl = `${API_BASE_URL}/${validation.type}/${validation.id}`;
        setConvertedUrl(fixedUrl);
        copyToClipboard(fixedUrl);
      } else {
        setConvertedUrl('');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid Roblox URL (e.g., https://www.roblox.com/games/1234567)",
        });
      }
    } catch (error) {
      setConvertedUrl('');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid URL format",
      });
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const url = new URL(text);
      const validation = validateRobloxUrl(url);

      if (validation.isValid && validation.type && validation.id) {
        setInputUrl(text);
      } else {
        setInputUrl(text);
      }
    } catch (error) {
      setInputUrl('');
    }
  }

  const clearConvertedUrl = () => {
    setConvertedUrl('');
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        variant: "default",
        title: "Success",
        description: "URL copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy URL",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Toaster />
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-center flex justify-center w-full">
            <img src="/vercel.svg" alt="Fix Roblox" width={50} height={50} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter Roblox URL (e.g., https://www.roblox.com/games/1234567)"
              className="bg-background font-mono"
            />
            <div className="flex gap-2">
              <Button type="submit" className="w-full bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                Convert URL
              </Button>
              <Button 
                type="button"
                onClick={async () => {
                  await pasteFromClipboard();
                  const form = document.querySelector('form');
                  form?.requestSubmit();
                }} 
                className="aspect-square"
                variant="outline"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {convertedUrl && (
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold">Converted URL:</h2>
                  <div className="flex gap-2">
                    {/* <Button
                      variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(convertedUrl)}
                  >
                    <ClipboardCopy className="h-4 w-4" />
                    </Button> */}
                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearConvertedUrl}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  </div>
                </div>
                <code className="block w-full p-2 bg-[#111111] rounded-md break-all text-white">
                  {convertedUrl}
                </code>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
