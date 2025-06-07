
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

  const callChatGPT = async (userMessage: string) => {
    const apiKey = "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";

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are PolyPros, an AI study assistant specifically designed for polytechnic students. You help with Engineering Mathematics, Computer Science, Electronics, Mechanical Engineering, Civil Engineering, and other polytechnic subjects. Provide clear, educational explanations and solutions. Always be helpful and encouraging to students.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('ChatGPT API Error:', error);
      return "I'm having trouble connecting to my AI brain right now. Please try again in a moment.";
    }
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

    // Simulate typing delay
    const delay = Math.min(currentInput.length * 30 + 1000, 3000);
    
    setTimeout(async () => {
      const botResponseText = await callChatGPT(currentInput);
      const botResponse: Message = {
        id: Date.now() + 1,
        text: botResponseText,
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
              AI-powered by ChatGPT • Made for polytechnic students
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
