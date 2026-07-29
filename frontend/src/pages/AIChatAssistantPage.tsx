import React, { useState } from 'react';
import { MessageSquareCode, Send, Sparkles, Bot, User, CornerDownLeft } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { mockChatMessages } from '../utils/mockData';
import { ChatMessage } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const AIChatAssistantPage: React.FC = () => {
  const { activeProject } = useProject();
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        message: `Based on your project idea **"${activeProject?.title}"** and the 3 indexed papers in our FAISS vector store: The system utilizes Gemini 1.5 Pro to ground all answers with verified literature citations.`,
        contextChunks: ['ArXiv paper 2402.12345', 'FastAPI Architecture Specs'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquareCode className="w-6 h-6 text-violet-400" />
            <span>AI Copilot Workspace Assistant</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Context-aware chat powered by Google Gemini API & FAISS Vector RAG index.
          </p>
        </div>
        <Badge variant="purple" className="font-mono text-xs">FAISS Vector Indexed</Badge>
      </div>

      {/* Chat Container */}
      <Card className="glass-panel flex-1 flex flex-col overflow-hidden">
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
                    <p className="whitespace-pre-wrap">{msg.message}</p>

                    {msg.contextChunks && msg.contextChunks.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/40 text-[10px] space-y-1">
                        <span className="font-semibold text-violet-400">RAG Context References:</span>
                        <div className="flex flex-wrap gap-1">
                          {msg.contextChunks.map((chunk, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-background/50 border border-border/40 font-mono">
                              {chunk}
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
              <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Copilot is retrieving vector context & generating response...</span>
            </div>
          )}
        </CardContent>

        {/* Input Bar */}
        <div className="p-3 border-t border-border/60 bg-card/60">
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about research papers, architecture specs, or code blueprints..."
              className="flex-1 text-xs h-10"
            />
            <Button type="submit" variant="gradient" className="h-10 px-4">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
