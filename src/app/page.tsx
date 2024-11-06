'use client';

import { useEffect, useState } from "react";
import { checkServerStatus } from "@/utils/api";

export default function Home() {
  const [status, setStatus] = useState<string>('Checking...');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkServerStatus();
        setStatus(result);
      } catch (err) {
        setStatus('Error connecting to server');
        console.error(err);
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Server Status</h2>
          <p className={`text-lg ${status === 'pong' ? 'text-green-500' : 'text-red-500'}`}>
            {status}
          </p>
        </div>
      </main>
    </div>
  );
}
