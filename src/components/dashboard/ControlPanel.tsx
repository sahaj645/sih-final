import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Zap, 
  Beaker, 
  AlertTriangle, 
  RotateCcw,
  Settings,
  Languages
} from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';
import { Card } from '@/components/dashboard/ui/card';
import { Badge } from '@/components/dashboard/ui/badge';
import { Slider } from '@/components/dashboard/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/dashboard/ui/select';
import { VoiceSettings, Language, LanguageOption } from '@/types';
import { demoScenarios } from '@/data/scenarios';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  isMonitoring: boolean;
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
  onRunScenario: (scenarioName: string) => void;
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (settings: Partial<VoiceSettings>) => void;
  onTestVoice: () => void;
  activeScenario?: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'International', elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India', elevenLabsVoiceId: 'pFZP5JQG7iQjIQuC4Bku' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal/Bangladesh', elevenLabsVoiceId: 'cgSgspJ2msm6clMCkdW9' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam', elevenLabsVoiceId: 'N2lVS1w4EtoT3dr4eOWO' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', region: 'Manipur', elevenLabsVoiceId: 'SAz9YHcvj6GT2YYXdXww' },
  { code: 'grt', name: 'Garo', nativeName: 'গারো', region: 'Meghalaya', elevenLabsVoiceId: 'TX3LPaxmHKxFdv7VOQHJ' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ţawng', region: 'Mizoram', elevenLabsVoiceId: 'XB0fDUnXU5powFXDhCwa' },
  { code: 'kha', name: 'Khasi', nativeName: 'কা খাসি', region: 'Meghalaya', elevenLabsVoiceId: 'Xb7hH8MSUJpSbSDYk0k2' },
  { code: 'nag', name: 'Nagamese', nativeName: 'নাগামেছে', region: 'Nagaland', elevenLabsVoiceId: 'bIHbv24MWmeRgasZH58o' },
  { code: 'kok', name: 'Kokborok', nativeName: 'কোকবোরোক', region: 'Tripura', elevenLabsVoiceId: 'iP95p4xoKVk53GoZ742B' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', region: 'Jharkhand/West Bengal', elevenLabsVoiceId: 'nPczCjzI2devNBz1zQrb' },
  { code: 'bod', name: 'Tibetan', nativeName: 'བོད་སྐད།', region: 'Arunachal Pradesh', elevenLabsVoiceId: 'onwK4e9ZLuTAKqWW03F9' },
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  isMonitoring,
  onStartMonitoring,
  onStopMonitoring,
  onRunScenario,
  voiceSettings,
  onVoiceSettingsChange,
  onTestVoice,
  activeScenario,
}) => {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const getScenarioSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-warning text-warning-foreground';
      case 'medium':
        return 'bg-warning/70 text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getScenarioIcon = (name: string) => {
    if (name.includes('Contamination') || name.includes('Chemical')) {
      return <Beaker className="h-4 w-4" />;
    }
    if (name.includes('Emergency')) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    if (name.includes('Normal')) {
      return <RotateCcw className="h-4 w-4" />;
    }
    return <Zap className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Main Controls */}
      <Card className="glass-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <Settings className="h-6 w-6 text-primary mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Control Panel
            </h2>
            <p className="text-sm text-muted-foreground">
              System monitoring and simulation controls
            </p>
          </div>
        </div>

        {/* Monitoring Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div>
              <h3 className="font-medium text-foreground">Water Quality Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                {isMonitoring ? 'System is actively collecting data' : 'System is stopped'}
              </p>
            </div>
            <Button
              onClick={isMonitoring ? onStopMonitoring : onStartMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
              size="lg"
              className={cn(
                "min-w-24 transition-all duration-300",
                isMonitoring ? "btn-danger animate-pulse-glow" : "btn-water"
              )}
            >
              {isMonitoring ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>

          {/* Voice Alert Controls */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-medium text-foreground">Voice Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Multilingual voice notification system
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                >
                  <Languages className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant={voiceSettings.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => onVoiceSettingsChange({ enabled: !voiceSettings.enabled })}
                >
                  {voiceSettings.enabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {showVoiceSettings && (
              <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
                {/* Language Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Language</label>
                  <Select
                    value={voiceSettings.language}
                    onValueChange={(value: Language) => onVoiceSettingsChange({ language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex flex-col">
                            <span>{lang.nativeName} ({lang.name})</span>
                            <span className="text-xs text-muted-foreground">{lang.region}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Speed</label>
                    <Slider
                      value={[voiceSettings.rate]}
                      onValueChange={([value]) => onVoiceSettingsChange({ rate: value })}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{voiceSettings.rate}x</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Pitch</label>
                    <Slider
                      value={[voiceSettings.pitch]}
                      onValueChange={([value]) => onVoiceSettingsChange({ pitch: value })}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{voiceSettings.pitch}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Volume</label>
                    <Slider
                      value={[voiceSettings.volume]}
                      onValueChange={([value]) => onVoiceSettingsChange({ volume: value })}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                    <span className="text-xs text-muted-foreground">{Math.round(voiceSettings.volume * 100)}%</span>
                  </div>
                </div>

                {/* ElevenLabs Settings */}
                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Use ElevenLabs TTS</label>
                    <Button
                      variant={voiceSettings.useElevenLabs ? "default" : "outline"}
                      size="sm"
                      onClick={() => onVoiceSettingsChange({ useElevenLabs: !voiceSettings.useElevenLabs })}
                    >
                      {voiceSettings.useElevenLabs ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  {voiceSettings.useElevenLabs && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">API Key</label>
                      <input
                        type="password"
                        placeholder="Enter ElevenLabs API Key"
                        value={voiceSettings.elevenLabsApiKey || ''}
                        onChange={(e) => onVoiceSettingsChange({ elevenLabsApiKey: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground">
                        Get your API key from ElevenLabs dashboard for better multilingual support
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTestVoice}
                  disabled={!voiceSettings.enabled}
                  className="w-full"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Test Voice Alert
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Demo Scenarios */}
      <Card className="glass-card p-6">
        <div className="flex items-start gap-3 mb-6">
          <Zap className="h-6 w-6 text-primary mt-1" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Demo Scenarios
            </h2>
            <p className="text-sm text-muted-foreground">
              Simulate various water quality conditions for testing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {demoScenarios.map((scenario, index) => (
            <button
              key={scenario.name}
              onClick={() => onRunScenario(scenario.name)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all duration-300 animate-slide-up",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeScenario === scenario.name
                  ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary"
                  : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getScenarioIcon(scenario.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium">
                      {scenario.name}
                    </span>
                    <Badge className={getScenarioSeverityColor(scenario.severity)}>
                      {scenario.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {scenario.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Duration: {scenario.duration}s
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {activeScenario && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg animate-slide-down">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">
                Running scenario: {activeScenario}
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ControlPanel;