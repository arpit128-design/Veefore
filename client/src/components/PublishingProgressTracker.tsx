import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, Video, Image, Upload, Cog } from 'lucide-react';

interface PublishingProgressTrackerProps {
  contentType: string;
  isPublishing: boolean;
  isScheduled?: boolean;
  contentId?: string;
  onComplete?: () => void;
}

export function PublishingProgressTracker({ 
  contentType, 
  isPublishing, 
  isScheduled = false,
  contentId,
  onComplete 
}: PublishingProgressTrackerProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [publishingStatus, setPublishingStatus] = useState<string>('preparing');

  const getSteps = (type: string, scheduled: boolean = false) => {
    const isVideo = type === 'video' || type === 'reel';
    const baseSteps = [
      ...(scheduled ? [{ name: 'Scheduled time reached', duration: 1 }] : []),
      { name: isScheduled ? 'Retrieving content' : 'Uploading file', duration: isScheduled ? 2 : 3 },
      { name: 'Creating Instagram container', duration: 2 },
      ...(isVideo ? [
        { name: 'Processing video (Instagram)', duration: 90 },
        { name: 'Quality verification', duration: 15 }
      ] : [
        { name: 'Processing image', duration: 8 }
      ]),
      { name: 'Publishing to feed', duration: 5 },
      { name: 'Verification complete', duration: 0 }
    ];
    return baseSteps;
  };

  const steps = getSteps(contentType, isScheduled);
  const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);

  useEffect(() => {
    if (!isPublishing) {
      setProgress(0);
      setCurrentStep(0);
      setTimeRemaining(0);
      return;
    }

    let elapsedTime = 0;
    const interval = setInterval(() => {
      elapsedTime += 1;
      
      // Calculate current step and progress
      let stepTime = 0;
      let currentStepIndex = 0;
      
      for (let i = 0; i < steps.length; i++) {
        if (elapsedTime <= stepTime + steps[i].duration) {
          currentStepIndex = i;
          break;
        }
        stepTime += steps[i].duration;
      }

      setCurrentStep(currentStepIndex);
      
      // Calculate overall progress
      const overallProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setProgress(overallProgress);
      
      // Calculate time remaining
      const remaining = Math.max(totalDuration - elapsedTime, 0);
      setTimeRemaining(remaining);
      
      // Complete when done
      if (elapsedTime >= totalDuration) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPublishing, contentType, totalDuration]);

  if (!isPublishing) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getContentIcon = () => {
    if (contentType === 'video' || contentType === 'reel') {
      return <Video className="h-5 w-5 text-electric-cyan" />;
    }
    return <Image className="h-5 w-5 text-electric-cyan" />;
  };

  return (
    <Card className="content-card glassmorphism border-electric-cyan/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getContentIcon()}
              <div>
                <h3 className="font-semibold text-white">Publishing {contentType}</h3>
                <p className="text-sm text-asteroid-silver">
                  {timeRemaining > 0 ? `${formatTime(timeRemaining)} remaining` : 'Almost done...'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-electric-cyan">{Math.round(progress)}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isComplete = currentStep > index;
              const isPending = currentStep < index;

              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : isActive ? (
                      <Clock className="h-5 w-5 text-electric-cyan animate-pulse" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-asteroid-silver/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${
                      isComplete ? 'text-green-400' : 
                      isActive ? 'text-white' : 
                      'text-asteroid-silver/60'
                    }`}>
                      {step.name}
                    </p>
                    {isActive && step.duration > 10 && (
                      <p className="text-xs text-asteroid-silver/80">
                        This may take up to {formatTime(step.duration)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Video Processing Notice */}
          {(contentType === 'video' || contentType === 'reel') && currentStep <= 2 && (
            <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-300">
                <p className="font-medium">Video Processing</p>
                <p>Instagram needs time to process video files. Larger files may take longer.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}