import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  HelpCircle,
  ChevronDown,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface DMAutomation {
  id: string;
  isActive: boolean;
  postImage: string;
  postCaption: string;
  postStatus: 'scheduled' | 'published';
  keyword: string;
  totalComments: number;
  dmsSent: number;
  openRate: number;
  totalClicks: number;
}

const MOCK_AUTOMATIONS: DMAutomation[] = [
  {
    id: "1",
    isActive: true,
    postImage: "/api/placeholder/60/60",
    postCaption: "What are your thoughts on our latest...",
    postStatus: "scheduled",
    keyword: "dfd",
    totalComments: 0,
    dmsSent: 0,
    openRate: 0,
    totalClicks: 0
  }
];

export default function DMAutomationList() {
  const [automations, setAutomations] = useState<DMAutomation[]>(MOCK_AUTOMATIONS);
  const { toast } = useToast();

  const toggleAutomation = (id: string, isActive: boolean) => {
    setAutomations(prevAutomations => 
      prevAutomations.map(automation => 
        automation.id === id ? { ...automation, isActive } : automation
      )
    );
    
    toast({
      title: isActive ? "Automation activated" : "Automation paused",
      description: `DM automation has been ${isActive ? 'activated' : 'paused'}.`,
    });
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prevAutomations => 
      prevAutomations.filter(automation => automation.id !== id)
    );
    
    toast({
      title: "Automation deleted",
      description: "DM automation has been permanently deleted.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">Your DM automations</h1>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        <Button 
          className="bg-black hover:bg-gray-800 text-white"
          onClick={() => window.location.href = '/comment-to-dm-automation'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create a DM automation
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-left font-medium text-gray-700 py-4 px-6">Status</TableHead>
                <TableHead className="text-left font-medium text-gray-700 py-4 px-6">Post or reel</TableHead>
                <TableHead className="text-left font-medium text-gray-700 py-4 px-6">Post status</TableHead>
                <TableHead className="text-left font-medium text-gray-700 py-4 px-6">Keyword</TableHead>
                <TableHead className="text-left font-medium text-gray-700 py-4 px-6">
                  <div className="flex items-center space-x-1">
                    <span>Total comments</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="text-left font-medium text-gray-700 py-4 px-6">DMs sent</TableHead>
                <TableHead className="text-left font-medium text-gray-700 py-4 px-6">Open rate</TableHead>
                <TableHead className="text-left font-medium text-gray-700 py-4 px-6">Total clicks</TableHead>
                <TableHead className="w-12 py-4 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.map((automation) => (
                <TableRow key={automation.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <TableCell className="py-4 px-6">
                    <Switch
                      checked={automation.isActive}
                      onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
                      className="data-[state=checked]:bg-black"
                    />
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate max-w-[200px]">
                          {automation.postCaption}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        automation.postStatus === 'scheduled' ? 'bg-blue-500' : 'bg-green-500'
                      }`} />
                      <span className="text-sm text-gray-700 capitalize">
                        {automation.postStatus}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-sm text-gray-900">{automation.keyword}</span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-sm text-gray-900">
                      {automation.totalComments > 0 ? automation.totalComments : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-sm text-gray-900">
                      {automation.dmsSent > 0 ? automation.dmsSent : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-sm text-gray-900">
                      {automation.openRate > 0 ? `${automation.openRate}%` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <span className="text-sm text-gray-900">
                      {automation.totalClicks > 0 ? automation.totalClicks : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => window.location.href = `/comment-to-dm-automation?edit=${automation.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteAutomation(automation.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty state for when no automations exist */}
      {automations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No DM automations yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first DM automation to start engaging with your audience automatically.
          </p>
          <Button 
            onClick={() => window.location.href = '/comment-to-dm-automation'}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create your first automation
          </Button>
        </motion.div>
      )}
    </div>
  );
}