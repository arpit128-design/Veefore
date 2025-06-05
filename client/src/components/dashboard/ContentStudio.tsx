import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Video, Smartphone, Image, Edit, FileImage, Youtube } from "lucide-react";

const contentTools = [
  {
    id: 'video',
    name: 'Video Generator',
    description: 'AI-powered videos',
    icon: Video,
    gradient: 'from-electric-cyan to-nebula-purple',
    route: '/content-studio?tool=video'
  },
  {
    id: 'reel',
    name: 'Reel Builder',
    description: 'Short-form content',
    icon: Smartphone,
    gradient: 'from-solar-gold to-red-500',
    route: '/content-studio?tool=reel'
  },
  {
    id: 'post',
    name: 'Post Creator',
    description: 'Visual posts',
    icon: Image,
    gradient: 'from-nebula-purple to-pink-500',
    route: '/content-studio?tool=post'
  },
  {
    id: 'caption',
    name: 'Caption AI',
    description: 'Smart captions',
    icon: Edit,
    gradient: 'from-green-400 to-blue-500',
    route: '/content-studio?tool=caption'
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail Editor',
    description: 'Eye-catching covers',
    icon: FileImage,
    gradient: 'from-yellow-400 to-orange-500',
    route: '/content-studio?tool=thumbnail'
  }
];

export function ContentStudio() {
  const [, setLocation] = useLocation();

  return (
    <Card className="content-card holographic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
          AI Content Studio
        </CardTitle>
        <Button 
          variant="outline" 
          className="glassmorphism hover:bg-opacity-80"
          onClick={() => setLocation('/content-studio')}
        >
          View All Tools
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {contentTools.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              className="p-4 h-auto flex-col space-y-3 bg-cosmic-blue hover:bg-space-gray transition-all group particle-trail"
              onClick={() => setLocation(tool.route)}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-white">{tool.name}</div>
                <div className="text-xs text-asteroid-silver mt-1">{tool.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
