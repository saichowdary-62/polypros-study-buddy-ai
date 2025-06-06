
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
      text: "Hello! I'm PolyPros, your AI study assistant for polytechnic subjects. Ask me questions about Engineering Mathematics, Computer Science, Electronics, Mechanical, Civil Engineering, and more. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced keyword-based responses for polytechnic subjects
    if (lowerMessage.includes("mathematics") || lowerMessage.includes("math") || lowerMessage.includes("calculus") || lowerMessage.includes("algebra")) {
      return "I can help with Engineering Mathematics topics including:\n• Calculus and Differential Equations\n• Linear Algebra and Matrices\n• Statistics and Probability\n• Complex Numbers\n• Fourier Series\n\nWhat specific math topic would you like to explore?";
    }
    
    if (lowerMessage.includes("computer") || lowerMessage.includes("programming") || lowerMessage.includes("coding") || lowerMessage.includes("software")) {
      return "Great! I can assist with Computer Science topics:\n• Programming Languages (C, C++, Java, Python)\n• Data Structures and Algorithms\n• Database Management Systems\n• Web Development\n• Operating Systems\n• Computer Networks\n\nWhich area interests you most?";
    }
    
    if (lowerMessage.includes("electronics") || lowerMessage.includes("circuit") || lowerMessage.includes("digital") || lowerMessage.includes("analog")) {
      return "I can help with Electronics Engineering:\n• Digital Electronics and Logic Gates\n• Analog Circuits and Op-Amps\n• Microprocessors and Microcontrollers\n• Communication Systems\n• Electronic Devices and Circuits\n• PCB Design\n\nWhat specific electronics topic do you need help with?";
    }
    
    if (lowerMessage.includes("mechanical") || lowerMessage.includes("machine") || lowerMessage.includes("thermal") || lowerMessage.includes("fluid")) {
      return "I can assist with Mechanical Engineering:\n• Thermodynamics and Heat Transfer\n• Fluid Mechanics\n• Machine Design and Manufacturing\n• Engineering Materials\n• Strength of Materials\n• CAD/CAM\n\nWhich mechanical engineering topic would you like to discuss?";
    }
    
    if (lowerMessage.includes("civil") || lowerMessage.includes("construction") || lowerMessage.includes("structural") || lowerMessage.includes("concrete")) {
      return "I can help with Civil Engineering:\n• Structural Analysis and Design\n• Concrete Technology\n• Surveying and Leveling\n• Environmental Engineering\n• Construction Management\n• Highway Engineering\n\nWhat civil engineering topic interests you?";
    }
    
    if (lowerMessage.includes("exam") || lowerMessage.includes("question") || lowerMessage.includes("test") || lowerMessage.includes("preparation")) {
      return "I'm here to help with exam preparation! I can:\n• Explain complex concepts in simple terms\n• Provide practice problems\n• Share study tips and strategies\n• Help with previous year questions\n• Create revision notes\n\nWhich subject's exam are you preparing for?";
    }
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey") || lowerMessage.includes("start")) {
      return "Hello! Welcome to PolyPros! 👋\n\nI'm your AI study companion for all polytechnic subjects. I can help you with:\n✓ Concept explanations\n✓ Problem solving\n✓ Exam preparation\n✓ Study guidance\n\nJust ask me anything about your polytechnic studies!";
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! I'm always here to help with your polytechnic studies. Feel free to ask more questions anytime! 😊";
    }
    
    // Default response with more helpful suggestions
    return `I'd be happy to help you with "${userMessage}"! 🤔\n\nI specialize in polytechnic subjects like:\n• Engineering Mathematics\n• Computer Science & Programming\n• Electronics Engineering\n• Mechanical Engineering\n• Civil Engineering\n\nCould you be more specific about which subject or topic you'd like help with? The more details you provide, the better I can assist you!`;
  };

  const handleSendMessage = () => {
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

    // Simulate more realistic ChatGPT-like typing delay
    const delay = Math.min(currentInput.length * 50 + 1000, 3000); // Between 1-3 seconds based on input length
    
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: generateBotResponse(currentInput),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-4xl h-[90vh] sm:h-[600px] flex flex-col animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-600 text-white rounded-t-lg shrink-0">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-sm sm:text-base">PolyPros Chat</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-700 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div className="flex items-start space-x-2 max-w-[85%] sm:max-w-[80%]">
                    {message.isBot && (
                      <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${
                        message.isBot
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-600 text-white ml-auto"
                      }`}
                    >
                      <p className="text-sm sm:text-base whitespace-pre-line leading-relaxed">
                        {message.text}
                      </p>
                      <p className={`text-xs mt-1 ${message.isBot ? "text-gray-500" : "text-blue-200"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {!message.isBot && (
                      <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[85%] sm:max-w-[80%]">
                    <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-3 sm:p-4 border-t bg-gray-50 shrink-0">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask questions about polytechnic subjects..."
                className="flex-1 text-sm sm:text-base"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                className="bg-blue-600 hover:bg-blue-700 shrink-0 h-10 w-10 p-0"
                disabled={isTyping || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI-powered study assistant • Made for polytechnic students
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
