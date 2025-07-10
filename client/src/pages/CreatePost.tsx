import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  Save, 
  Send, 
  ChevronDown, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  MapPin,
  Hash,
  Sparkles,
  Clock,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { SiFacebook, SiInstagram, SiX, SiLinkedin, SiYoutube } from 'react-icons/si';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  avatar: string;
  isConnected: boolean;
}

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
}

export default function CreatePost() {
  const [selectedAccounts, setSelectedAccounts] = useState<SocialAccount[]>([]);
  const [postContent, setPostContent] = useState('');
  const [firstComment, setFirstComment] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [publishViaMobile, setPublishViaMobile] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock social accounts - in real app, fetch from API
  const availableAccounts: SocialAccount[] = [
    { id: '1', platform: 'Instagram', username: 'arpit9996363', avatar: '/api/placeholder/40/40', isConnected: true },
    { id: '2', platform: 'Facebook', username: 'MetaTraq', avatar: '/api/placeholder/40/40', isConnected: true },
    { id: '3', platform: 'Twitter', username: 'veefore_ai', avatar: '/api/placeholder/40/40', isConnected: true },
    { id: '4', platform: 'LinkedIn', username: 'VeeFore', avatar: '/api/placeholder/40/40', isConnected: true },
    { id: '5', platform: 'YouTube', username: 'VeeFore Studio', avatar: '/api/placeholder/40/40', isConnected: true },
  ];

  const platformIcons = {
    Instagram: <SiInstagram className="w-4 h-4" />,
    Facebook: <SiFacebook className="w-4 h-4" />,
    Twitter: <SiX className="w-4 h-4" />,
    LinkedIn: <SiLinkedin className="w-4 h-4" />,
    YouTube: <SiYoutube className="w-4 h-4" />,
  };

  const platformColors = {
    Instagram: 'bg-pink-500 text-white',
    Facebook: 'bg-blue-600 text-white',
    Twitter: 'bg-sky-500 text-white',
    LinkedIn: 'bg-blue-700 text-white',
    YouTube: 'bg-red-600 text-white',
  };

  const handleAccountSelect = (account: SocialAccount) => {
    if (selectedAccounts.find(acc => acc.id === account.id)) {
      setSelectedAccounts(selectedAccounts.filter(acc => acc.id !== account.id));
    } else {
      setSelectedAccounts([...selectedAccounts, account]);
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newMedia: MediaFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            name: file.name
          };
          setMediaFiles(prev => [...prev, newMedia]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (mediaId: string) => {
    setMediaFiles(mediaFiles.filter(media => media.id !== mediaId));
  };

  const handlePost = () => {
    // Here you would implement the actual posting logic
    console.log('Posting to:', selectedAccounts);
    console.log('Content:', postContent);
    console.log('Media:', mediaFiles);
    console.log('Hashtags:', hashtags);
    console.log('First comment:', firstComment);
    console.log('Location:', location);
  };

  const handleSchedule = () => {
    setIsScheduled(true);
    // Implement scheduling logic
  };

  const handleSaveDraft = () => {
    // Implement draft saving logic
    console.log('Saving draft...');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create a post</h1>
            <p className="text-gray-600 mt-1">Share your content across multiple platforms</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSaveDraft} className="border-gray-300">
              <Save className="w-4 h-4 mr-2" />
              Save as draft
            </Button>
            <Button variant="outline" onClick={handleSchedule} className="border-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule for later
            </Button>
            <Button 
              onClick={handlePost} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedAccounts.length === 0 || (!postContent && mediaFiles.length === 0)}
            >
              <Send className="w-4 h-4 mr-2" />
              Post now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Post Creation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Selection */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">Publish to</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    Clear accounts
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Selected Accounts */}
                  <div className="flex flex-wrap gap-2">
                    {selectedAccounts.map(account => (
                      <Badge
                        key={account.id}
                        variant="secondary"
                        className={`${platformColors[account.platform]} flex items-center gap-2 px-3 py-2 text-sm`}
                      >
                        {platformIcons[account.platform]}
                        {account.username}
                        <button
                          onClick={() => handleAccountSelect(account)}
                          className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {/* Available Accounts */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableAccounts.map(account => (
                        <button
                          key={account.id}
                          onClick={() => handleAccountSelect(account)}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            selectedAccounts.find(acc => acc.id === account.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${platformColors[account.platform]} flex items-center justify-center`}>
                            {platformIcons[account.platform]}
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900 text-sm">{account.username}</p>
                            <p className="text-xs text-gray-500">{account.platform}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Creation */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  Your post
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <SiFacebook className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <SiInstagram className="w-4 h-4 text-pink-600" />
                    </button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Content Input */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write your caption, then customize it for each social network"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{postContent.length}</span>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Enhance with AI
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Trending
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        <Hash className="w-4 h-4 mr-1" />
                        Hashtags
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Media Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {mediaFiles.length === 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2">Add photos or videos</p>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="border-gray-300"
                          >
                            <ImageIcon className="w-4 h-4 mr-1" />
                            Upload media
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-300">
                            <Video className="w-4 h-4 mr-1" />
                            Record video
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mediaFiles.map(media => (
                        <div key={media.id} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {media.type === 'image' ? (
                              <img
                                src={media.url}
                                alt={media.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={media.url}
                                className="w-full h-full object-cover"
                                controls={false}
                              />
                            )}
                          </div>
                          <button
                            onClick={() => removeMedia(media.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Advanced options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* First Comment */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">First comment</Label>
                  <p className="text-xs text-gray-500">First comment is only available for direct publishing and for posts</p>
                  <Textarea
                    placeholder="Write the first comment for this post"
                    value={firstComment}
                    onChange={(e) => setFirstComment(e.target.value)}
                    className="min-h-[80px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>0 / 2,200</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Trending
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                        <Hash className="w-4 h-4 mr-1" />
                        Hashtags
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Hashtags</Label>
                  <Input
                    placeholder="Add relevant hashtags"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Add Location (optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search for a location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Mobile Notification */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Publish via mobile notification</p>
                      <p className="text-xs text-gray-500">Get notified on your phone to publish manually</p>
                    </div>
                  </div>
                  <Switch
                    checked={publishViaMobile}
                    onCheckedChange={setPublishViaMobile}
                  />
                </div>

                {/* Boost Post */}
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Boost your post</p>
                      <p className="text-xs text-gray-600">Reach more people with targeted promotion</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Set up boost
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Preview Cards */}
            {selectedAccounts.map(account => (
              <Card key={account.id} className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded ${platformColors[account.platform]} flex items-center justify-center`}>
                      {platformIcons[account.platform]}
                    </div>
                    <span className="font-medium text-gray-900">{account.platform} Post</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Post Preview */}
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {account.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{account.username}</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                      <div className="ml-auto">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Post Content */}
                    {postContent && (
                      <p className="text-sm text-gray-900 leading-relaxed">{postContent}</p>
                    )}

                    {/* Media Preview */}
                    {mediaFiles.length > 0 && (
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={mediaFiles[0].url}
                          alt="Post preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    {/* Engagement Buttons */}
                    <div className="flex items-center gap-4 pt-2">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">Like</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Comment</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                      <button className="ml-auto text-gray-600 hover:text-gray-800">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* No accounts selected */}
            {selectedAccounts.length === 0 && (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Select accounts to see preview</p>
                  <p className="text-sm text-gray-500">Choose which platforms you want to post to</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}