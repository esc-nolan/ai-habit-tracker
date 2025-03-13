'use client';

import { useState } from 'react';
import { getAISuggestions } from '@/lib/groq';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AISuggestions({ query }: { query: string }) {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGetSuggestion = async () => {
    setLoading(true);
    setError('');
    try {
      const prompt = `Give me personalized suggestions or motivational tips for working on the task "${query}". Make it actionable.`;
      const aiResponse = await getAISuggestions(prompt);
      setSuggestion(aiResponse);
    } catch (err) {
      setError("Failed to get suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <Button onClick={handleGetSuggestion} disabled={loading} className="w-full">
        {loading ? 'Generating Suggestion...' : 'Get AI Suggestion'}
      </Button>

      {suggestion && (
        <Textarea value={suggestion} readOnly className="h-32" />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
