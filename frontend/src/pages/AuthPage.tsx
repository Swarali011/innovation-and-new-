import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight, Github, Mail, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('prachi.swarali@dypatil.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Prachi & Swarali');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, name);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-violet-500/20 text-white mb-2">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Innovation_and_new <span className="gradient-text">AI</span>
          </h1>
          <p className="text-xs text-muted-foreground font-medium">From Idea to Innovation in Minutes.</p>
        </div>

        <Card className="glass-panel border-border/60 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg font-bold">
              {isRegister ? 'Create your Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-xs">
              {isRegister ? 'Start converting ideas into research pipelines' : 'Sign in to access your innovation workspace'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Full Name / Team Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prachi P & Swarali L"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="researcher@dypatil.edu"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="gradient" className="w-full h-10 mt-2 font-semibold">
                <span>{isRegister ? 'Register Account' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border/60 text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-violet-400 font-semibold hover:underline"
                >
                  {isRegister ? 'Sign In' : 'Create One'}
                </button>
              </p>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-muted-foreground pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Secured with Firebase Authentication</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
