import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Plus, 
  Trash2, 
  Eye, 
  BarChart3,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  ImageIcon,
  PlayCircle,
  Grid3x3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  isScheduled: boolean;
  status: 'published' | 'scheduled' | 'draft';
}

interface CommentReply {
  id: string;
  text: string;
  emoji?: string;
}

interface DMAutomation {
  id?: string;
  postId: string;
  socialAccountId: string;
  keyword: string;
  commentReplies: CommentReply[];
  commentDelay: number;
  commentDelayUnit: 'minutes' | 'hours';
  directMessage: {
    text: string;
    buttonText: string;
    websiteUrl: string;
  };
  isActive: boolean;
  analytics: {
    totalComments: number;
    dmsSent: number;
    openRate: number;
    totalClicks: number;
  };
}

const STEP_TITLES = [
  "Select post",
  "Comment replies", 
  "Direct message",
  "Review & save"
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    caption: 'Check out our new product launch! What do you think?',
    mediaUrl: '/api/placeholder/400/400',
    mediaType: 'image',
    timestamp: '2024-01-15T10:00:00Z',
    likes: 245,
    comments: 32,
    shares: 18,
    platform: 'instagram',
    isScheduled: false,
    status: 'published'
  },
  {
    id: '2',
    caption: 'Behind the scenes of our latest project. Swipe to see more!',
    mediaUrl: '/api/placeholder/400/400',
    mediaType: 'carousel',
    timestamp: '2024-01-14T14:30:00Z',
    likes: 189,
    comments: 24,
    shares: 12,
    platform: 'instagram',
    isScheduled: false,
    status: 'published'
  },
  {
    id: '3',
    caption: 'Exciting news coming soon! Stay tuned...',
    mediaUrl: '/api/placeholder/400/400',
    mediaType: 'video',
    timestamp: '2024-01-13T09:15:00Z',
    likes: 312,
    comments: 45,
    shares: 27,
    platform: 'instagram',
    isScheduled: false,
    status: 'published'
  },
  {
    id: '4',
    caption: 'Professional insights on industry trends and best practices',
    mediaUrl: '/api/placeholder/400/400',
    mediaType: 'image',
    timestamp: '2024-01-12T16:45:00Z',
    likes: 156,
    comments: 18,
    shares: 22,
    platform: 'linkedin',
    isScheduled: false,
    status: 'published'
  },
  {
    id: '5',
    caption: 'Quick thoughts on the latest market developments',
    mediaUrl: '/api/placeholder/400/400',
    mediaType: 'image',
    timestamp: '2024-01-11T11:20:00Z',
    likes: 89,
    comments: 12,
    shares: 15,
    platform: 'twitter',
    isScheduled: false,
    status: 'published'
  },
  {
    id: '6',
    caption: 'Community update: Thank you for your continued support!',
    mediaUrl: '/api/placeholder/400/400',
    mediaType: 'image',
    timestamp: '2024-01-10T13:00:00Z',
    likes: 234,
    comments: 28,
    shares: 19,
    platform: 'facebook',
    isScheduled: false,
    status: 'published'
  }
];

export default function CommentToDMAutomation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedSocialAccount, setSelectedSocialAccount] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'instagram' | 'linkedin' | 'twitter' | 'facebook'>('all');
  const [keyword, setKeyword] = useState('');
  const [commentReplies, setCommentReplies] = useState<CommentReply[]>([
    { id: '1', text: '', emoji: '' }
  ]);
  const [commentDelay, setCommentDelay] = useState(5);
  const [commentDelayUnit, setCommentDelayUnit] = useState<'minutes' | 'hours'>('minutes');
  const [directMessage, setDirectMessage] = useState({
    text: '',
    buttonText: '',
    websiteUrl: ''
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    username: string;
    profilePicture: string | null;
    initials: string;
  }>({
    username: 'rahulc1020',
    profilePicture: null,
    initials: 'R'
  });
  
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [loadingSocialAccounts, setLoadingSocialAccounts] = useState(false);

  // Generate initials from username
  const generateInitials = (username: string): string => {
    if (!username) return 'U';
    
    const cleanUsername = username.replace('@', '');
    const firstLetter = cleanUsername.charAt(0).toUpperCase();
    
    // Try to find a second significant character
    const restOfName = cleanUsername.slice(1);
    const secondLetter = restOfName.split('').find(char => 
      char.match(/[A-Z0-9]/) || (char >= '0' && char <= '9')
    );
    
    return secondLetter ? firstLetter + secondLetter.toUpperCase() : firstLetter;
  };

  // Get platform-specific data for DM previews
  const getPlatformData = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return {
          name: 'Instagram',
          color: '#e91e63',
          icon: '📷',
          accentColor: '#e91e63',
          bgColor: '#fafafa'
        };
      case 'linkedin':
        return {
          name: 'LinkedIn',
          color: '#0077b5',
          icon: '💼',
          accentColor: '#0077b5',
          bgColor: '#f3f6f8'
        };
      case 'twitter':
        return {
          name: 'Twitter',
          color: '#1da1f2',
          icon: '🐦',
          accentColor: '#1da1f2',
          bgColor: '#f7f9fa'
        };
      case 'facebook':
        return {
          name: 'Facebook',
          color: '#1877f2',
          icon: '👥',
          accentColor: '#1877f2',
          bgColor: '#f0f2f5'
        };
      default:
        return {
          name: 'Instagram',
          color: '#e91e63',
          icon: '📷',
          accentColor: '#e91e63',
          bgColor: '#fafafa'
        };
    }
  };

  // Fetch social accounts and user profile data
  useEffect(() => {
    const fetchSocialAccounts = async () => {
      try {
        setLoadingSocialAccounts(true);
        // Import the authenticated apiRequest function
        const { apiRequest } = await import('@/lib/queryClient');
        
        // Fetch all social accounts
        const socialResponse = await apiRequest('GET', '/api/social-accounts');
        const accounts = await socialResponse.json();
        
        setSocialAccounts(accounts);
        
        // Set user profile from first Instagram account (for DM preview)
        const instagramAccount = accounts.find((acc: any) => acc.platform === 'instagram');
        if (instagramAccount) {
          const initials = generateInitials(instagramAccount.username);
          
          // Check multiple possible profile picture field names
          const profilePictureUrl = instagramAccount.profilePicture || 
                                   instagramAccount.profilePictureUrl || 
                                   instagramAccount.profile_picture_url ||
                                   instagramAccount.avatar ||
                                   instagramAccount.pictureUrl ||
                                   null;
          
          setUserProfile({
            username: instagramAccount.username,
            profilePicture: profilePictureUrl,
            initials
          });
          
          console.log('Full Instagram account data:', instagramAccount);
          console.log('Updated profile with Instagram account:', {
            username: instagramAccount.username,
            hasProfilePicture: !!profilePictureUrl,
            profilePictureUrl: profilePictureUrl,
            initials,
            allFields: Object.keys(instagramAccount)
          });
        } else {
          console.log('No Instagram account found in response');
        }
      } catch (error) {
        console.error('Error fetching social accounts:', error);
        // Keep default values on error - show 'R' for rahulc1020
        setUserProfile({
          username: 'rahulc1020',
          profilePicture: null,
          initials: 'R'
        });
      } finally {
        setLoadingSocialAccounts(false);
      }
    };
    
    fetchSocialAccounts();
  }, []);

  const filteredPosts = selectedSocialAccount
    ? MOCK_POSTS.filter(post => post.platform === selectedSocialAccount.platform)
    : [];

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0:
        return selectedSocialAccount !== null && selectedPost !== null;
      case 1:
        return commentReplies.some(reply => reply.text.trim() !== '');
      case 2:
        return directMessage.text.trim() !== '' && directMessage.buttonText.trim() !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const addCommentReply = () => {
    const newReply: CommentReply = {
      id: Date.now().toString(),
      text: '',
      emoji: ''
    };
    setCommentReplies([...commentReplies, newReply]);
  };

  const removeCommentReply = (index: number) => {
    if (commentReplies.length > 1) {
      setCommentReplies(commentReplies.filter((_, i) => i !== index));
    }
  };

  const updateCommentReply = (index: number, field: 'text' | 'emoji', value: string) => {
    const updatedReplies = [...commentReplies];
    updatedReplies[index][field] = value;
    setCommentReplies(updatedReplies);
  };

  const handleSaveAutomation = () => {
    const automation: DMAutomation = {
      postId: selectedPost?.id || '',
      socialAccountId: selectedPost?.platform || '',
      keyword,
      commentReplies,
      commentDelay,
      commentDelayUnit,
      directMessage,
      isActive: true,
      analytics: {
        totalComments: 0,
        dmsSent: 0,
        openRate: 0,
        totalClicks: 0
      }
    };

    console.log('Saving automation:', automation);
    // Here you would typically save to your backend
    alert('Automation saved successfully!');
  };

  const InstagramPostPreview = ({ post }: { post: Post }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-sm">
      <div className="p-3 flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">U</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">username</div>
          <div className="text-xs text-gray-500">2h</div>
        </div>
      </div>
      <div className="aspect-square bg-gray-100">
        <img 
          src={post.mediaUrl} 
          alt={post.caption}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          </div>
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
        <div className="text-sm text-gray-900 mb-2">
          <span className="font-semibold">username</span> {post.caption}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          View all {post.comments} comments
        </div>
        {keyword && (
          <div className="text-xs text-gray-500 mb-2">
            <span className="font-semibold">user123</span> {keyword}
          </div>
        )}
        {commentReplies.length > 0 && commentReplies[0].text && (
          <div className="text-xs text-gray-500 mb-2">
            <span className="font-semibold">username</span> {commentReplies[0].text} {commentReplies[0].emoji}
          </div>
        )}
        <div className="text-xs text-gray-500">2 hours ago</div>
      </div>
    </div>
  );

  const PlatformDMPreview = ({ platform }: { platform: string }) => {
    const platformData = getPlatformData(platform);
    const currentTime = new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).toUpperCase();
    
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        width: '380px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: platformData.bgColor
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: platformData.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white'
            }}>{platformData.icon}</span>
          </div>
          <span style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#262626'
          }}>
            {platformData.name} direct message
          </span>
        </div>

        {/* Message Area */}
        <div style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Timestamp */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#8e8e8e',
              fontWeight: '500'
            }}>
              {currentTime}
            </span>
          </div>

          {/* Message Bubble */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: 'auto'
          }}>
            {/* Sender Avatar */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: platformData.accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
              border: '2px solid #ffffff'
            }}>
              {userProfile.profilePicture ? (
                <img 
                  src={userProfile.profilePicture} 
                  alt={`${userProfile.username} profile`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#ffffff'
                }}>
                  {userProfile.initials || 'R'}
                </span>
              )}
            </div>

            {/* Message Content */}
            <div style={{
              backgroundColor: '#f1f1f1',
              borderRadius: '18px',
              padding: '12px 16px',
              width: '280px',
              position: 'relative'
            }}>
              <div style={{
                fontSize: '14px',
                lineHeight: '1.4',
                color: directMessage.text ? '#262626' : '#8e8e8e',
                marginBottom: '8px',
                minHeight: '20px'
              }}>
                {directMessage.text || 'I\'m so excited you\'d like to see what I\'ve got on offer!'}
              </div>
              
              {/* Button */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '10px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: directMessage.buttonText ? '#262626' : '#8e8e8e'
                }}>
                  {directMessage.buttonText || 'See products'}
                </span>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 0'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#0095f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontSize: '16px',
                color: 'white'
              }}>📷</span>
            </div>
            <div style={{
              flex: 1,
              fontSize: '14px',
              color: '#8e8e8e',
              fontWeight: '400'
            }}>
              Message...
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '16px', color: '#8e8e8e' }}>🎙️</span>
              <span style={{ fontSize: '16px', color: '#8e8e8e' }}>📷</span>
              <span style={{ fontSize: '16px', color: '#8e8e8e' }}>📎</span>
              <span style={{ fontSize: '16px', color: '#8e8e8e' }}>➕</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex comment-to-dm-automation">
      {/* Main Content */}
      <div className="w-1/2 bg-white border-r border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DM automation</h1>
                <p className="text-sm text-gray-500">Create automated comment to DM flows</p>
              </div>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {STEP_TITLES.map((title, index) => (
                <div key={index} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                    getStepStatus(index) === "completed" 
                      ? "bg-green-100 text-green-700 border-2 border-green-300" 
                      : getStepStatus(index) === "current"
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  )}>
                    {getStepStatus(index) === "completed" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < STEP_TITLES.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-200 mx-2" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              {STEP_TITLES.map((title, index) => (
                <span key={index} className="flex-1 text-center">
                  {title}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Post Selection */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* First: Select Social Account */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Select a social account</h2>
                
                {loadingSocialAccounts ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {socialAccounts.map((account) => (
                      <div
                        key={account.id}
                        onClick={() => setSelectedSocialAccount(account)}
                        className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md p-4 ${
                          selectedSocialAccount?.id === account.id 
                            ? 'border-blue-500 bg-blue-50 shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Profile Picture or Avatar */}
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {account.profilePictureUrl ? (
                              <img 
                                src={account.profilePictureUrl} 
                                alt={account.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center text-white font-semibold ${
                                account.platform === 'instagram' ? 'bg-pink-500' :
                                account.platform === 'linkedin' ? 'bg-blue-600' :
                                account.platform === 'twitter' ? 'bg-sky-500' :
                                'bg-blue-800'
                              }`}>
                                {generateInitials(account.username)}
                              </div>
                            )}
                          </div>
                          
                          {/* Account Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              {account.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                              {account.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-600" />}
                              {account.platform === 'twitter' && <Twitter className="w-4 h-4 text-sky-600" />}
                              {account.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-800" />}
                              <span className="text-sm text-gray-500 capitalize">{account.platform}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 truncate">@{account.username}</p>
                            <p className="text-xs text-gray-500">{account.followersCount || 0} followers</p>
                          </div>
                        </div>
                        
                        {selectedSocialAccount?.id === account.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Second: Select Post (only after account is selected) */}
              {selectedSocialAccount && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Select a post from @{selectedSocialAccount.username}
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          selectedPost?.id === post.id 
                            ? 'border-blue-500 bg-blue-50 shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
                          <img 
                            src={post.mediaUrl} 
                            alt={post.caption}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {post.platform === 'instagram' && <Instagram className="w-4 h-4 text-purple-600" />}
                              {post.platform === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-600" />}
                              {post.platform === 'twitter' && <Twitter className="w-4 h-4 text-sky-600" />}
                              {post.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-800" />}
                              <span className="text-xs text-gray-500 capitalize">{post.platform}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {post.mediaType === 'image' && <ImageIcon className="w-4 h-4 text-gray-400" />}
                              {post.mediaType === 'video' && <PlayCircle className="w-4 h-4 text-gray-400" />}
                              {post.mediaType === 'carousel' && <Grid3x3 className="w-4 h-4 text-gray-400" />}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{post.caption}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{post.likes} likes</span>
                            <span>{post.comments} comments</span>
                          </div>
                        </div>
                        {selectedPost?.id === post.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Comment Replies */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Set up comment replies</h2>
                <p className="text-sm text-gray-600 mb-4">Configure how the system responds to comments before sending DMs</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trigger keyword or phrase
                    </label>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder=""
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment replies ({commentReplies.length})
                    </label>
                    <div className="space-y-2">
                      {commentReplies.map((reply, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={reply.text}
                            onChange={(e) => updateCommentReply(index, 'text', e.target.value)}
                            placeholder=""
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={reply.emoji}
                            onChange={(e) => updateCommentReply(index, 'emoji', e.target.value)}
                            placeholder="😊"
                            className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCommentReply(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={addCommentReply}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add reply</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reply delay
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={commentDelay}
                        onChange={(e) => setCommentDelay(Number(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={commentDelayUnit}
                        onChange={(e) => setCommentDelayUnit(e.target.value as 'minutes' | 'hours')}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="minutes">minutes</option>
                        <option value="hours">hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Direct Message */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Configure direct message</h2>
                <p className="text-sm text-gray-600 mb-4">Set up the automated direct message that will be sent to users</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Direct message text
                    </label>
                    <textarea
                      value={directMessage.text}
                      onChange={(e) => setDirectMessage({...directMessage, text: e.target.value})}
                      placeholder="I'm so excited you'd like to see what I've got an offer!"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button text
                      </label>
                      <input
                        type="text"
                        value={directMessage.buttonText}
                        onChange={(e) => setDirectMessage({...directMessage, buttonText: e.target.value})}
                        placeholder="See products"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={directMessage.websiteUrl}
                        onChange={(e) => setDirectMessage({...directMessage, websiteUrl: e.target.value})}
                        placeholder=""
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review and Save */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Review and activate</h2>
                <p className="text-sm text-gray-600 mb-4">Review your automation settings and activate the flow</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Selected Post</h3>
                    {selectedPost && (
                      <div className="flex items-center space-x-3">
                        <img 
                          src={selectedPost.mediaUrl} 
                          alt={selectedPost.caption}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedPost.caption}</p>
                          <p className="text-xs text-gray-500 capitalize">{selectedPost.platform}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Comment Automation</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Trigger keyword:</span>
                        <span className="text-sm font-medium text-gray-900">{keyword || 'Any comment'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Comment replies:</span>
                        <span className="text-sm font-medium text-gray-900">{commentReplies.length} replies</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reply delay:</span>
                        <span className="text-sm font-medium text-gray-900">{commentDelay} {commentDelayUnit}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Direct Message</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Message:</span>
                        <p className="text-sm font-medium text-gray-900 mt-1">{directMessage.text}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Button text:</span>
                        <span className="text-sm font-medium text-gray-900">{directMessage.buttonText}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Website URL:</span>
                        <span className="text-sm font-medium text-gray-900">{directMessage.websiteUrl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {currentStep < STEP_TITLES.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNextStep()}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline">
                    Save for later
                  </Button>
                  <Button
                    onClick={handleSaveAutomation}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      


      {/* Right Panel - Preview */}
      <div className="w-1/2 bg-gray-50 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {selectedPost?.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
            {selectedPost?.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-600" />}
            {selectedPost?.platform === 'twitter' && <Twitter className="w-5 h-5 text-sky-600" />}
            {selectedPost?.platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-800" />}
            <span className="font-medium text-gray-900">
              {selectedPost?.platform === 'instagram' && 'Instagram Preview'}
              {selectedPost?.platform === 'linkedin' && 'LinkedIn Preview'}
              {selectedPost?.platform === 'twitter' && 'Twitter Preview'}
              {selectedPost?.platform === 'facebook' && 'Facebook Preview'}
              {!selectedPost && 'Platform Preview'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {currentStep === 2 && selectedPost && (
            <div key="dm-preview">
              <PlatformDMPreview platform={selectedPost.platform} />
            </div>
          )}
          {currentStep !== 2 && selectedPost && (
            <div key="post-preview">
              <InstagramPostPreview post={selectedPost} />
            </div>
          )}

          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Automation Analytics</h3>
                <Badge variant="secondary">Live Preview</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-sm text-gray-600">Total comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-sm text-gray-600">DMs sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-sm text-gray-600">Open rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-sm text-gray-600">Total clicks</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}