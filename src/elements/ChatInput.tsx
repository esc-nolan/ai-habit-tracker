'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void; // Callback to parent to handle API call
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput(''); // Clear input after sending
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 border-t border-zinc-700 bg-zinc-900 rounded-b-xl">
      <Input
        type="text"
        placeholder="Ask AI for suggestions..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 bg-zinc-800 text-white border-none focus:ring-0 focus-visible:ring-0 focus:outline-none"
      />
      <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700 text-white">
        <SendHorizonal className="h-5 w-5" />
      </Button>
    </form>
  );
}
