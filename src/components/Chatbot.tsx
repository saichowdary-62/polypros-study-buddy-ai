
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, Key } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  onClose: () => void;
}

export const Chatbot = ({ onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm PolyPros, your AI study assistant for polytechnic subjects. Please enter your OpenAI API key above to start chatting with me!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('openai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    // Save to localStorage
    if (value) {
      localStorage.setItem('openai-api-key', value);
    } else {
      localStorage.removeItem('openai-api-key');
    }
  };

  const callChatGPT = async (userMessage: string) => {
    if (!apiKey) {
      return "Please enter your OpenAI API key above to start chatting.";
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are PolyPros, an AI study assistant specifically designed for polytechnic students. You help with Engineering Mathematics, Computer Science, Electronics, Mechanical Engineering, Civil Engineering, and other polytechnic subjects. Provide clear, educational explanations and solutions. Always be helpful and encouraging to students. Format your responses clearly with proper spacing and structure. Be conversational and engaging like ChatGPT.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        
        if (response.status === 429) {
          return "I apologize, but I'm currently experiencing high demand. This usually means the API usage limit has been reached. Please try again in a few minutes.";
        } else if (response.status === 401) {
          return "Invalid API key. Please check your OpenAI API key and try again.";
        } else {
          return `I encountered an error (${response.status}). Please check your API key and try again.`;
        }
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      return "I'm experiencing connection issues right now. Please check your internet connection and API key, then try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!apiKey) {
      alert("Please enter your OpenAI API key first.");
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const botResponseText = await callChatGPT(currentInput);
      const botResponse: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an unexpected error. Please check your API key and try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
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

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-semibold">PolyPros</h1>
            <p className="text-sm text-blue-100">AI Study Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-blue-700 h-10 w-10 p-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* API Key Input */}
      <div className="bg-blue-50 border-b p-4 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Key className="h-5 w-5 text-blue-600" />
            <Input
              type="password"
              placeholder="Enter your OpenAI API key..."
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              className="flex-1"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Your API key is stored locally and never shared. Get your key from{" "}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              OpenAI Platform
            </a>
          </p>
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
                    message.isBot ? "bg-blue-100" : "bg-gray-700"
                  }`}>
                    {message.isBot ? (
                      <Bot className="h-4 w-4 text-blue-600" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.isBot
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-600 text-white"
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.isBot ? "text-gray-500" : "text-blue-200"
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
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t bg-white p-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about polytechnic subjects..."
                className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isTyping || !apiKey}
              />
              <Button 
                onClick={handleSendMessage} 
                className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 w-12 p-0 shrink-0"
                disabled={isTyping || !inputValue.trim() || !apiKey}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by OpenAI GPT • Made for polytechnic students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
