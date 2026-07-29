import React, { useState } from 'react';
import { Settings, Key, User, Moon, Sun, Check, GraduationCap, Box, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const SettingsPage: React.FC = () => {
  const { user, updateApiKey } = useAuth();
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState(user?.geminiApiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-6 h-6 text-violet-400" />
          <span>User Settings & Configuration</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage API keys, environment settings, and application preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Gemini API Key Configuration */}
        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-violet-400" />
                <span>Google Gemini API Key Override</span>
              </CardTitle>
              <Badge variant="purple" className="font-mono text-[10px]">Gemini 1.5 Pro</Badge>
            </div>
            <CardDescription className="text-xs">
              Provide your own Gemini API key for high-rate limit multi-agent executions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveKey} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">API Key Secret</label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                />
              </div>
              <Button type="submit" variant="gradient" size="sm" className="text-xs">
                {saved ? <Check className="w-3.5 h-3.5 mr-1" /> : null}
                {saved ? 'Key Saved' : 'Save API Key'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base">Appearance & Interface Theme</CardTitle>
            <CardDescription className="text-xs">Customize workspace visual style</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="flex items-center space-x-2 text-xs"
            >
              <Moon className="w-4 h-4 text-amber-400" />
              <span>Dark Theme</span>
            </Button>
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="flex items-center space-x-2 text-xs"
            >
              <Sun className="w-4 h-4 text-indigo-600" />
              <span>Light Theme</span>
            </Button>
          </CardContent>
        </Card>

        {/* Project & Team Accreditation (From PPT) */}
        <Card className="glass-panel border-violet-500/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-violet-400" />
              <CardTitle className="text-base">Project Credits & Team</CardTitle>
            </div>
            <CardDescription className="text-xs">Official metadata from Innovation_and_new AI representation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
              <p className="font-semibold text-foreground">Innovation_and_new AI</p>
              <p className="text-muted-foreground">From Idea to Innovation in Minutes.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Development Team</p>
                <p className="font-bold text-violet-400 text-sm mt-0.5">Prachi P & Swarali L</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/60">
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Institution</p>
                <p className="font-bold text-foreground text-xs mt-0.5">Ajeenkya D.Y.Patil School of Engineering</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
