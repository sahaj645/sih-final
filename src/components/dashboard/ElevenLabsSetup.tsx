import React, { useState } from 'react';
import { Card } from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { Input } from '@/components/dashboard/ui/input';
import { Label } from '@/components/dashboard/ui/label';
import { Volume2, ExternalLink, Key } from 'lucide-react';

interface ElevenLabsSetupProps {
  onApiKeySubmit: (apiKey: string) => void;
  onSkip: () => void;
}

const ElevenLabsSetup: React.FC<ElevenLabsSetupProps> = ({ onApiKeySubmit, onSkip }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    try {
      onApiKeySubmit(apiKey.trim());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Volume2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Enhanced Voice Alerts
        </h2>
        <p className="text-sm text-muted-foreground">
          Connect ElevenLabs for superior multilingual voice support including all Northeast Indian languages
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            ElevenLabs API Key
          </Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your ElevenLabs API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally and never shared
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={!apiKey.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? 'Setting up...' : 'Enable Enhanced Voice'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className="w-full"
          >
            Skip (Use Browser Speech)
          </Button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-muted/20 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2">
          Don't have an API key?
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-primary hover:underline"
          onClick={() => window.open('https://elevenlabs.io/api', '_blank')}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Get free API key from ElevenLabs
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-foreground">Supported Languages:</h4>
        <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
          <span>• English, Hindi, Bengali</span>
          <span>• Assamese, Manipuri</span>
          <span>• Mizo, Khasi, Garo</span>
          <span>• Nagamese, Kokborok</span>
          <span>• Santali, Tibetan</span>
        </div>
      </div>
    </Card>
  );
};

export default ElevenLabsSetup;