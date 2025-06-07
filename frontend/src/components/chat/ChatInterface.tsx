"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, User, Menu, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you want help with: "${userMessage.content}"\n\nI'm your Gmail AI assistant, ready to help you automate email tasks, manage your inbox, and boost your productivity. What would you like me to help you with today?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-800`}>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">Gmail AI</span>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 bg-transparent border-gray-700 hover:bg-gray-800"
            onClick={() => {
              setMessages([]);
              setInputValue('');
            }}
          >
            <MessageSquare className="h-4 w-4" />
            New Chat
          </Button>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Recent Chats</p>
            <div className="space-y-1">
              {messages.length > 0 && (
                <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
                  <p className="text-sm truncate">
                    {messages[0]?.content || 'New conversation'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-lg font-medium">Gmail AI</h1>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-300">
                2.5 Flash
              </span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!hasMessages ? (
            // Welcome Screen
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
              <div className="text-center max-w-2xl">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                
                <h1 className="text-4xl font-medium mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Hello! I'm your Gmail AI Assistant
                </h1>
                
                <p className="text-gray-400 text-lg mb-8">
                  I can help you automate Gmail tasks, manage your inbox, send emails, and boost your productivity.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  {[
                    "What's in my inbox?",
                    "Send an email to my team",
                    "Archive old emails",
                    "Check unread messages"
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-4 h-auto text-left justify-start bg-transparent border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                      onClick={() => setInputValue(suggestion)}
                    >
                      <div>
                        <p className="font-medium">{suggestion}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {index === 0 && "View and organize your latest emails"}
                          {index === 1 && "Compose and send emails quickly"}
                          {index === 2 && "Clean up your inbox automatically"}
                          {index === 3 && "Get a summary of unread messages"}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
              <div className="max-w-4xl mx-auto py-6 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-4">
                    <div className="flex gap-4">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className={
                          message.type === 'user' 
                            ? "bg-blue-100 text-blue-600" 
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        }>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {message.type === 'user' ? 'You' : 'Gmail AI'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                          <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Gmail AI</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gray-900 rounded-2xl border border-gray-700 focus-within:border-gray-600">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about your Gmail..."
                  className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 px-4 py-4 pr-20"
                  disabled={isLoading}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-white hover:bg-gray-700"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Gmail AI can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 