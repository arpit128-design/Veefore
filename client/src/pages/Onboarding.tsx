import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to VeeFore</CardTitle>
          <p className="text-xl text-gray-600 mt-2">
            AI-Powered Social Media Management
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">AI Content Creation</h3>
              <p className="text-sm text-gray-600">
                Generate engaging posts, captions, and media with AI
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-sm text-gray-600">
                Schedule posts at optimal times for maximum engagement
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-sm text-gray-600">
                Track performance and optimize your strategy
              </p>
            </div>
          </div>
          
          <p className="text-gray-600">
            Get started with VeeFore and take your social media to the next level.
          </p>
          
          <Button 
            onClick={handleGetStarted}
            className="flex items-center space-x-2"
            size="lg"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}