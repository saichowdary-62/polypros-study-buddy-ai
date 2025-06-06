
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      text: "Hello! I'm PolyPros, your AI study assistant for polytechnic subjects. Ask me questions or request answers related to any polytechnic topic - from Engineering Mathematics to Computer Science, Electronics, Mechanical, Civil, and more. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses for polytechnic subjects
    if (lowerMessage.includes("mathematics") || lowerMessage.includes("math")) {
      return "I can help with Engineering Mathematics topics like calculus, differential equations, linear algebra, and statistics. What specific math topic would you like to explore?";
    }
    
    if (lowerMessage.includes("computer") || lowerMessage.includes("programming") || lowerMessage.includes("coding")) {
      return "Great! I can assist with Computer Science topics including programming languages (C, C++, Java, Python), data structures, algorithms, database management, and web development. What would you like to know?";
    }
    
    if (lowerMessage.includes("electronics") || lowerMessage.includes("circuit")) {
      return "I can help with Electronics Engineering topics like digital circuits, analog circuits, microprocessors, communication systems, and electronic devices. What specific area interests you?";
    }
    
    if (lowerMessage.includes("mechanical") || lowerMessage.includes("machine")) {
      return "I can assist with Mechanical Engineering subjects including thermodynamics, fluid mechanics, machine design, manufacturing processes, and materials science. What topic would you like to discuss?";
    }
    
    if (lowerMessage.includes("civil") || lowerMessage.includes("construction")) {
      return "I can help with Civil Engineering topics like structural analysis, concrete technology, surveying, environmental engineering, and construction management. What would you like to learn about?";
    }
    
    if (lowerMessage.includes("exam") || lowerMessage.includes("question") || lowerMessage.includes("test")) {
      return "I can help you prepare for exams by explaining concepts, providing practice questions, and offering study tips for any polytechnic subject. Which subject's exam are you preparing for?";
    }
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm here to help you with all your polytechnic studies. Whether you need explanations, practice questions, or study guidance, just ask away!";
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". I can help explain polytechnic concepts, provide study materials, and answer questions across all engineering disciplines. Could you be more specific about which subject or topic you'd like help with? I cover Mathematics, Computer Science, Electronics, Mechanical, Civil Engineering, and more!`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay like ChatGPT
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: generateBotResponse(currentInput),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span>PolyPros Chat</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isBot
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                      {!message.isBot && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                      <div>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.isBot ? "text-gray-500" : "text-blue-200"}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                    <div className="flex items-start space-x-2">
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask questions or request answers about polytechnic subjects..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isTyping || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              AI-powered study assistant • Made for polytechnic students
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
