import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isError?: boolean;
}

interface ChatbotProps {
  onClose: () => void;
}

export const Chatbot = ({ onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm PolyPros, your study assistant for polytechnic subjects. I can help you with Engineering Mathematics, Computer Science, Electronics, Mechanical Engineering, Civil Engineering, and more! What would you like to learn about today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (retryMessage?: string) => {
    const messageToSend = retryMessage || inputValue.trim();
    if (!messageToSend || isTyping) return;

    // Add user message only if not retrying
    if (!retryMessage) {
      const newMessage: Message = {
        id: Date.now(),
        text: messageToSend,
        isBot: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue("");
    }

    setIsTyping(true);

    try {
      console.log('Sending message to chat function:', messageToSend);
      
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: messageToSend,
          conversationHistory: messages.slice(-10).map(msg => ({
            text: msg.text,
            isBot: msg.isBot
          }))
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to connect to AI service');
      }

      if (data?.error) {
        // Handle errors returned by the function
        console.error('AI service error:', data.error);
        
        const errorResponse: Message = {
          id: Date.now() + 1,
          text: data.error,
          isBot: true,
          timestamp: new Date(),
          isError: true,
        };
        
        setMessages(prev => [...prev, errorResponse]);
        
        // Show toast with retry option for certain errors
        if (data.error.includes('quota') || data.error.includes('high demand')) {
          toast.error('AI Service Issue', {
            description: data.error,
            action: {
              label: 'Retry',
              onClick: () => handleSendMessage(messageToSend)
            }
          });
        }
        
        return;
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

      console.log('AI response received:', data.response.substring(0, 100) + '...');

      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.response,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: `I'm having trouble connecting right now. ${errorMessage}. Please try again in a moment.`,
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      toast.error('Connection Error', {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => handleSendMessage(messageToSend)
        }
      });
      
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm PolyPros, your study assistant for polytechnic subjects. I can help you with Engineering Mathematics, Computer Science, Electronics, Mechanical Engineering, Civil Engineering, and more! What would you like to learn about today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col safe-area-inset">
      {/* Browser compatibility notice */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
        <p className="text-xs text-yellow-800">
          For best experience, use Chrome, Brave, or other modern browsers
        </p>
      </div>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-semibold">PolyPros</h1>
            <p className="text-sm text-blue-100">PolyPros Study Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-white hover:bg-blue-700 h-10 w-10 p-0"
            title="Clear chat"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-700 h-10 w-10 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${message.isBot ? "" : "flex-row-reverse space-x-reverse"}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot 
                      ? message.isError 
                        ? "bg-red-100" 
                        : "bg-blue-100" 
                      : "bg-gray-700"
                  }`}>
                    {message.isBot ? (
                      message.isError ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-blue-600" />
                      )
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 transition-all duration-300 animate-fade-in ${
                    message.isBot
                      ? message.isError
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-gray-100 text-gray-800 shadow-sm hover:shadow-md"
                      : "bg-blue-600 text-white shadow-sm"
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap animate-scale-in">
                      {message.text}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.isBot 
                        ? message.isError 
                          ? "text-red-500" 
                          : "text-gray-500" 
                        : "text-blue-200"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-gray-100 shadow-sm animate-scale-in">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t bg-white p-4 shrink-0 pb-safe">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3 mb-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about SBTET AP polytechnic subjects..."
                className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isTyping}
              />
              <Button 
                onClick={() => handleSendMessage()} 
                className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 w-12 p-0 shrink-0"
                disabled={isTyping || !inputValue.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              PolyPros Study Assistant • Made for SBTET AP students<br/>
              <span className="text-gray-400">Tip: Ask for "detailed explanation" for more info</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
