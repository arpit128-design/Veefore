import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Clock, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PublishingProgressTrackerProps {
  isVisible: boolean;
  status: 'preparing' | 'uploading' | 'processing' | 'scheduling' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  timeRemaining: string;
  onClose: () => void;
}

export default function PublishingProgressTracker({
  isVisible,
  status,
  progress,
  currentStep,
  timeRemaining,
  onClose
}: PublishingProgressTrackerProps) {
  useEffect(() => {
    if (status === 'completed') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  if (!isVisible) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'preparing':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'uploading':
        return <Upload className="h-5 w-5 text-electric-cyan animate-bounce" />;
      case 'processing':
        return <Zap className="h-5 w-5 text-nebula-purple animate-pulse" />;
      case 'scheduling':
        return <Clock className="h-5 w-5 text-electric-cyan animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-asteroid-silver" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'preparing':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'uploading':
        return 'border-electric-cyan/50 bg-electric-cyan/10';
      case 'processing':
        return 'border-nebula-purple/50 bg-nebula-purple/10';
      case 'scheduling':
        return 'border-electric-cyan/50 bg-electric-cyan/10';
      case 'completed':
        return 'border-green-400/50 bg-green-400/10';
      case 'error':
        return 'border-red-400/50 bg-red-400/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className={`content-card glassmorphism border-2 ${getStatusColor()} max-w-md w-full mx-auto`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <h3 className="font-semibold text-white">
                {status === 'completed' ? 'Success!' : 
                 status === 'error' ? 'Error' : 'Publishing Content'}
              </h3>
            </div>
            
            {status !== 'completed' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-asteroid-silver hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Progress Bar */}
            {status !== 'error' && (
              <div className="space-y-2">
                <Progress 
                  value={progress} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-asteroid-silver">
                  <span>{progress}%</span>
                  <span>{timeRemaining}</span>
                </div>
              </div>
            )}

            {/* Current Step */}
            <p className="text-sm text-asteroid-silver text-center">
              {currentStep}
            </p>

            {/* Status-specific content */}
            {status === 'completed' && (
              <div className="text-center">
                <p className="text-green-400 font-medium mb-2">
                  Content published successfully!
                </p>
                <p className="text-xs text-asteroid-silver">
                  This dialog will close automatically
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-3">
                <p className="text-red-400 font-medium">
                  Publishing failed
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="glassmorphism hover:bg-red-500/20 hover:border-red-400"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}