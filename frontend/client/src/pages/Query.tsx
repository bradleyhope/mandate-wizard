import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { API_ENDPOINTS, fetchAPI } from "@/lib/api";
import ReactMarkdown from 'react-markdown';
import { ChevronDown, Download } from "lucide-react";

// Get backend API URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://5000-iy1gh94d7s437eutwzpcu-aa64bff1.manusvm.computer';

interface Source {
  id: number;
  type: string;
  title: string;
  platform: string;
  metadata: Record<string, any>;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  followups?: string[];
  sources?: Source[];
  confidence?: number;
  intent?: string;
  context?: {
    referenced_person?: string;
    vector_count?: number;
    graph_count?: number;
    attributes?: Record<string, any>;
  };
  timestamp: Date;
}

interface QueryResponse {
  answer: string;
  followups?: string[];
}

export default function Query() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSources, setShowSources] = useState<{[key: number]: boolean}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus input after sending message
  useEffect(() => {
    if (!loading && messages.length > 0) {
      inputRef.current?.focus();
    }
  }, [loading, messages.length]);

  const exampleQueries = [
    {
      emoji: "🎬",
      text: "Who should I pitch a documentary about police investigating tramadol in Saudi Arabia?"
    },
    {
      emoji: "💕",
      text: "Who is the best person to pitch a rom-com TV show at Netflix in Los Angeles?"
    },
    {
      emoji: "📊",
      text: "What has Dan Lin greenlit this year?"
    },
    {
      emoji: "🎯",
      text: "What is Kennedy Corrin's current mandate at Netflix?"
    }
  ];

  const handleSubmit = async (query: string) => {
    if (!query.trim() || loading) return;

    const userMessage: Message = { role: "user", content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log('[Query] Sending question:', query);
      
      const userEmail = localStorage.getItem('mandate_wizard_email') || 'bradley@projectbrazen.com';
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': userEmail,
        },
        body: JSON.stringify({ question: query }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('[Query] Response received:', data);

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer,
        followups: data.follow_up_questions || data.followups,
        sources: data.sources || [],
        confidence: data.confidence,
        intent: data.intent,
        context: data.context,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('[Query] Error:', error);
      
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "The request timed out. The backend may be processing a complex query or experiencing issues. Please try a simpler question or try again later.";
        } else if (error.message.includes('HTTP 401')) {
          errorMessage = "Authentication failed. Please make sure you're logged in.";
        } else if (error.message.includes('HTTP 403')) {
          errorMessage = "Access denied. This feature requires a paid subscription.";
        } else if (error.message.includes('HTTP 500')) {
          errorMessage = "Server error. The backend encountered an issue processing your request.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Cannot connect to the backend server. Please check your internet connection.";
        }
      }
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            {messages.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Export as Markdown
                  const markdown = messages.map(msg => {
                    const role = msg.role === 'user' ? 'Q' : 'A';
                    let content = `**${role}:** ${msg.content}\n`;
                    if (msg.confidence) {
                      content += `\n*Confidence: ${Math.round(msg.confidence * 100)}%*\n`;
                    }
                    if (msg.followups && msg.followups.length > 0) {
                      content += `\n*Follow-ups:*\n${msg.followups.map(f => `- ${f}`).join('\n')}\n`;
                    }
                    if (msg.sources && msg.sources.length > 0) {
                      content += `\n*Sources:*\n${msg.sources.map(s => `- ${s.title} (${s.platform})`).join('\n')}\n`;
                    }
                    return content;
                  }).join('\n---\n\n');
                  
                  const blob = new Blob(
                    [`# Mandate Wizard - Conversation Export\nDate: ${new Date().toLocaleDateString()}\n\n${markdown}`],
                    { type: 'text/markdown' }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `mandate-wizard-chat-${Date.now()}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Chat
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl py-8">
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold mb-4">Mandate Wizard</h1>
              <p className="text-xl text-muted-foreground mb-12">Your Pitch Intelligence Assistant</p>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-12 max-w-2xl mx-auto text-left">
                <h3 className="font-semibold mb-3">What I can help you with:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Find the right executive for your project</li>
                  <li>• Research executive mandates & priorities</li>
                  <li>• Craft pitch strategies</li>
                  <li>• Track recent greenlights & trends</li>
                </ul>
              </div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <p className="text-sm font-medium text-muted-foreground mb-4">Try asking:</p>
                {exampleQueries.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(query.text);
                      handleSubmit(query.text);
                    }}
                    className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{query.emoji}</span>
                      <span className="text-sm flex-1">{query.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6 mb-24">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  // User message
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  // Assistant message
                  <div className="flex justify-start">
                    <div className="max-w-[85%]">
                      {/* Avatar */}
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          MW
                        </div>
                        <div className="text-xs text-muted-foreground">Mandate Wizard</div>
                      </div>
                      
                      {/* Content */}
                      <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border p-4">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        
                        {/* Confidence indicator */}
                        {msg.confidence !== undefined && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Confidence:</span>
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500" 
                                  style={{width: `${msg.confidence * 100}%`}}
                                />
                              </div>
                              <span className="font-medium">{Math.round(msg.confidence * 100)}%</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Follow-up questions */}
                        {msg.followups && msg.followups.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-muted-foreground mb-2">Continue with:</p>
                            <div className="flex flex-wrap gap-2">
                              {msg.followups.map((f, j) => (
                                <button
                                  key={j}
                                  onClick={() => {
                                    setInput(f);
                                    handleSubmit(f);
                                  }}
                                  disabled={loading}
                                  className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors disabled:opacity-50"
                                >
                                  {f}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Sources - collapsible */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <button
                              onClick={() => setShowSources(prev => ({...prev, [i]: !prev[i]}))}
                              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <span>View {msg.sources.length} sources</span>
                              <ChevronDown className={`w-3 h-3 transition-transform ${showSources[i] ? 'rotate-180' : ''}`} />
                            </button>
                            {showSources[i] && (
                              <div className="mt-2 space-y-2">
                                {msg.sources.map((source, j) => (
                                  <div key={j} className="text-xs p-2 bg-gray-50 rounded border">
                                    <div className="font-medium">{source.title}</div>
                                    <div className="text-muted-foreground">{source.platform}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      MW
                    </div>
                    <div className="text-xs text-muted-foreground">Mandate Wizard</div>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                      </div>
                      <span>Searching mandates...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Sticky */}
      <div className="sticky bottom-0 bg-white border-t shadow-lg">
        <div className="container max-w-3xl py-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(input);
                }
              }}
              placeholder="Ask about executives, mandates, or pitch strategy..."
              className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              autoFocus
            />
            <Button
              onClick={() => handleSubmit(input)}
              disabled={!input.trim() || loading}
              size="lg"
              className="px-6 rounded-xl"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
