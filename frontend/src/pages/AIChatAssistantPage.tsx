import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareCode, Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ChatMessage } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getChatResponse, getGeminiApiKey } from '../utils/geminiService';

const CHAT_LS_KEY = (id: string) => `chat_${id}`;

const WELCOME_MESSAGE = (title: string): ChatMessage => ({
  id: 'msg-welcome',
  sender: 'assistant',
  message: `Hello! I am your **Innovation_and_new AI Copilot** for the project **"${title}"**.\n\nI have indexed all research papers, identified gaps, and the project architecture. Ask me anything — from implementation details to research methodology, tech stack decisions, or literature insights.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

export const AIChatAssistantPage: React.FC = () => {
  const { activeProject } = useProject();
  const hasKey = !!getGeminiApiKey();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!activeProject) return [];
    try {
      const stored = localStorage.getItem(CHAT_LS_KEY(activeProject.id));
      if (stored) return JSON.parse(stored) as ChatMessage[];
    } catch {}
    return [WELCOME_MESSAGE(activeProject.title)];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reload messages when active project changes
  useEffect(() => {
    if (!activeProject) { setMessages([]); return; }
    try {
      const stored = localStorage.getItem(CHAT_LS_KEY(activeProject.id));
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([WELCOME_MESSAGE(activeProject.title)]);
      }
    } catch {
      setMessages([WELCOME_MESSAGE(activeProject.title)]);
    }
  }, [activeProject?.id]);

  // Persist to localStorage whenever messages change
  useEffect(() => {
    if (!activeProject || messages.length === 0) return;
    try {
      localStorage.setItem(CHAT_LS_KEY(activeProject.id), JSON.stringify(messages));
    } catch {}
  }, [messages, activeProject?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentInput = input;
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getChatResponse(
        currentInput,
        activeProject?.title || 'Research Project',
        activeProject?.domain || 'General AI',
        activeProject?.rawIdea || '',
        activeProject?.papers || [],
        activeProject?.gaps || []
      );

      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        message: responseText,
        contextChunks: activeProject?.papers?.slice(0, 2).map((p) => p.title) || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        message: 'Sorry, I encountered an error generating a response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (!activeProject) return;
    const fresh = [WELCOME_MESSAGE(activeProject.title)];
    setMessages(fresh);
    try {
      localStorage.setItem(CHAT_LS_KEY(activeProject.id), JSON.stringify(fresh));
    } catch {}
  };

  // Suggested prompts
  const suggestions = [
    'Explain the core architecture of this project',
    'What are the key research gaps we identified?',
    'How should I prioritize the implementation phases?',
    'Which papers are most relevant to our approach?',
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquareCode className="w-6 h-6 text-violet-400" />
            <span>AI Copilot Workspace Assistant</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeProject
              ? `Context-aware chat for "${activeProject.title}" — powered by ${hasKey ? 'Google Gemini API' : 'Smart AI Engine'}.`
              : 'Select a project to start chatting.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="font-mono text-xs">
            {hasKey ? '🟢 Gemini Live' : '🔵 Smart Mode'}
          </Badge>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-xs text-muted-foreground hover:text-destructive h-8"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* No project selected */}
      {!activeProject ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Bot className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground text-sm">No active project selected.</p>
            <p className="text-xs text-muted-foreground">Create or select a project to start chatting.</p>
          </div>
        </div>
      ) : (
        <Card className="glass-panel flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-violet-600 text-white'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`space-y-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-violet-600 text-white rounded-tr-none'
                          : 'bg-muted/60 text-foreground border border-border/60 rounded-tl-none'
                      }`}
                    >
                      {/* Render basic markdown bold */}
                      <p className="whitespace-pre-wrap">
                        {msg.message.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={i}>{part.slice(2, -2)}</strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </p>

                      {msg.contextChunks && msg.contextChunks.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/40 text-[10px] space-y-1">
                          <span className="font-semibold text-violet-400">📚 Context References:</span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {msg.contextChunks.map((chunk, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-background/50 border border-border/40 font-mono"
                              >
                                {chunk.length > 40 ? chunk.slice(0, 40) + '…' : chunk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1 font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground p-2">
                <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span className="animate-pulse">Copilot is generating a response…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </CardContent>

          {/* Suggested prompts (only when few messages) */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 transition-colors font-mono"
                >
                  <Sparkles className="w-2.5 h-2.5 inline mr-1" />
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="p-3 border-t border-border/60 bg-card/60">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about research papers, architecture, implementation, or research gaps…"
                className="flex-1 text-xs h-10"
                disabled={isTyping}
              />
              <Button type="submit" variant="gradient" className="h-10 px-4" disabled={isTyping || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
            {!hasKey && (
              <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">
                💡 Add your Gemini API key in{' '}
                <a href="/settings" className="text-violet-400 hover:underline">
                  Settings
                </a>{' '}
                for real AI-powered responses.
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
