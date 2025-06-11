
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

export const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <Card 
      className="text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white group relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardContent className="p-6 relative z-10">
        <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-blue-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
