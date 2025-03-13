'use client';

import { useState } from 'react';
import ChatInput from './ChatInput';
import { getAISuggestions } from '@/lib/groq';

export default function ChatSection() {
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; text: string }[]>([]);

  const handleSend = async (userMessage: string) => {
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    const prompt = `You are helping me as a Todo and habit tracker chatbot. Break large goals into smaller actionable tasks for working on the task "${userMessage}". Make it actionable. only return a list of tasks.`;

    const aiResponse = await getAISuggestions(prompt);
    

    setMessages((prev) => [...prev, { type: 'ai', text: aiResponse }]);
  };

  return (
    <div className="flex flex-col h-[450px] border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900">
      {/* Chat Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.type === 'user' ? 'bg-green-600 ml-auto text-white' : 'bg-zinc-700 text-gray-200'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
