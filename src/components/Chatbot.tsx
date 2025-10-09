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
      text: "Hey! 😊 I'm PolyPros AI, your friendly study buddy for polytechnic subjects. I can help you with Engineering Math, Computer Science, Electronics, Mechanical, Civil, and more!\n\nWhat would you like to learn today?",
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
        text: "Hey! 😊 I'm PolyPros AI, your friendly study buddy for polytechnic subjects. I can help you with Engineering Math, Computer Science, Electronics, Mechanical, Civil, and more!\n\nWhat would you like to learn today?",
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-50 flex flex-col">
      {/* Browser compatibility notice */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200 px-3 py-1.5 text-center animate-slide-down">
        <p className="text-[10px] sm:text-xs text-blue-800 font-medium">
          For best experience, use Chrome, Brave, or other modern browsers
        </p>
      </div>

      {/* Header - optimized for mobile */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex items-center justify-between shadow-lg shrink-0 animate-slide-down">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="bg-white/20 p-1.5 sm:p-2 rounded-full animate-pulse shrink-0">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-bold truncate">PolyPros AI</h1>
            <p className="text-xs sm:text-sm text-blue-100 truncate flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0"></span>
              <span className="truncate">Online & Ready</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full transition-all duration-300 hover:scale-110 shrink-0"
            title="Clear chat"
          >
            <RefreshCw className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-full transition-all duration-300 hover:scale-110 shrink-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Area - improved mobile spacing */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-40 left-10 w-40 h-40 bg-purple-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <ScrollArea className="flex-1 px-3 sm:px-6 py-4 sm:py-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div className={`flex items-start gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] ${message.isBot ? "" : "flex-row-reverse"}`}>
                  <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    message.isBot
                      ? message.isError
                        ? "bg-red-100 shadow-md"
                        : "bg-gradient-to-br from-blue-100 to-purple-100 shadow-md"
                      : "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
                  }`}>
                    {message.isBot ? (
                      message.isError ? (
                        <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      )
                    ) : (
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all duration-300 animate-fade-in ${
                    message.isBot
                      ? message.isError
                        ? "bg-red-50 text-red-800 border border-red-200 shadow-sm"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  }`}>
                    <div className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                      {message.text}
                    </div>
                    <div className={`text-[11px] sm:text-xs mt-2 ${
                      message.isBot 
                        ? message.isError 
                          ? "text-red-500" 
                          : "text-gray-400" 
                        : "text-blue-100"
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
                <div className="flex items-start gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%]">
                  <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                    <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div className="rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white shadow-sm border border-gray-100">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input Area - mobile optimized */}
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-md p-3 sm:p-4 shrink-0 safe-area-inset-bottom shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 sm:gap-3 mb-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about SBTET subjects..."
                className="flex-1 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base h-12 sm:h-13 px-4 sm:px-5 shadow-sm transition-all duration-300"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full h-12 w-12 sm:h-13 sm:w-13 p-0 shrink-0 shadow-md active:scale-95 transition-all duration-200"
                disabled={isTyping || !inputValue.trim()}
              >
                <Send className="h-5 w-5 sm:h-5 sm:w-5" />
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 text-center px-2 flex items-center justify-center gap-1.5 flex-wrap">
              <Bot className="h-3 w-3 text-blue-600 shrink-0" />
              <span className="truncate">PolyPros AI Study Buddy • Made for SBTET AP students</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
