
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User } from "lucide-react";

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
      text: "Hello! I'm PolyPros, your AI study assistant for polytechnic subjects. Ask me anything about Engineering Mathematics, Computer Science, Electronics, Mechanical Engineering, Civil Engineering, and more!",
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

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Engineering Mathematics responses
    if (lowerMessage.includes('math') || lowerMessage.includes('calculus') || lowerMessage.includes('differential') || lowerMessage.includes('integral')) {
      return "I can help you with Engineering Mathematics! Whether it's calculus, differential equations, linear algebra, or statistics, I'm here to explain concepts step by step. What specific topic would you like to explore?";
    }
    
    // Computer Science responses
    if (lowerMessage.includes('programming') || lowerMessage.includes('code') || lowerMessage.includes('algorithm') || lowerMessage.includes('data structure')) {
      return "Great question about Computer Science! I can assist with programming concepts, algorithms, data structures, software engineering, and more. Which programming language or concept are you working with?";
    }
    
    // Electronics responses
    if (lowerMessage.includes('circuit') || lowerMessage.includes('electronic') || lowerMessage.includes('voltage') || lowerMessage.includes('current')) {
      return "Electronics is fascinating! I can help you understand circuits, digital electronics, analog systems, microprocessors, and electronic components. What specific electronics topic are you studying?";
    }
    
    // Mechanical Engineering responses
    if (lowerMessage.includes('mechanical') || lowerMessage.includes('engine') || lowerMessage.includes('thermodynamics') || lowerMessage.includes('mechanics')) {
      return "Mechanical Engineering covers so many interesting areas! From thermodynamics and fluid mechanics to machine design and manufacturing processes. What mechanical engineering concept can I help clarify?";
    }
    
    // Civil Engineering responses
    if (lowerMessage.includes('civil') || lowerMessage.includes('construction') || lowerMessage.includes('structural') || lowerMessage.includes('concrete')) {
      return "Civil Engineering is the backbone of our infrastructure! I can help with structural analysis, construction materials, surveying, environmental engineering, and more. What civil engineering topic interests you?";
    }
    
    // General study help
    if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('preparation')) {
      return "I'm here to help you study effectively! I can break down complex concepts, provide examples, create study plans, and explain difficult topics in simple terms. What subject or topic are you preparing for?";
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm excited to help you with your polytechnic studies. Whether you need help with calculations, understanding concepts, or preparing for exams, I'm here to assist. What would you like to learn about today?";
    }
    
    // Default helpful response
    return `That's an interesting question about "${userMessage}". As your AI study assistant, I'm designed to help with polytechnic subjects including Engineering Mathematics, Computer Science, Electronics, Mechanical Engineering, and Civil Engineering. Could you provide a bit more context about what specific aspect you'd like me to explain or help you with?`;
  };

  const simulateTyping = async (response: string): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate realistic typing delay (50-100ms per character)
      const typingDelay = Math.min(2000, response.length * 30);
      setTimeout(resolve, typingDelay);
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

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
      // Generate response
      const responseText = generateResponse(currentInput);
      
      // Simulate typing delay
      await simulateTyping(responseText);
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: responseText,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your request right now. Please try asking your question again!",
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
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                className="bg-blue-600 hover:bg-blue-700 rounded-full h-12 w-12 p-0 shrink-0"
                disabled={isTyping || !inputValue.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI Study Assistant • Made for polytechnic students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
