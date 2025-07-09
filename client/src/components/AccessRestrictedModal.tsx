import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AccessRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvedEmail: string;
  message?: string;
}

export function AccessRestrictedModal({ 
  isOpen, 
  onClose, 
  approvedEmail, 
  message = "Please sign in with your approved email address"
}: AccessRestrictedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Shield className="w-5 h-5 text-red-500" />
                    Access Restricted
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Warning Message */}
                <div className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-red-200">
                      {message}
                    </p>
                    <p className="text-xs text-red-300/80">
                      You're trying to access VeeFore with an unauthorized email address.
                    </p>
                  </div>
                </div>

                {/* Approved Email Display */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Your Approved Email
                  </h3>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                    <p className="text-center text-white font-mono text-sm">
                      {approvedEmail}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-300">
                    What to do next:
                  </h3>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>1. Sign out of your current Google account</p>
                    <p>2. Sign in with the approved email above</p>
                    <p>3. Try accessing VeeFore again</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(approvedEmail);
                    }}
                    className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Copy Email
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={onClose}
                  >
                    Got It
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}