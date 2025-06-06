
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
      className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in border-0 shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-blue-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
