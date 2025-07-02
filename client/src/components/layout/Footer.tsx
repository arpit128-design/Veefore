import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-purple-200/20 bg-gradient-to-r from-purple-950/10 via-blue-950/10 to-purple-950/10 backdrop-blur-sm">
      <div className="w-full">
        {/* Desktop: Account for sidebar with left margin */}
        <div className="hidden md:block ml-56 lg:ml-64 px-6 py-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-4xl mx-auto">
            {/* Main Copyright Line */}
            <div className="text-sm text-white/80">
              © 2025 Veefore — A product of{' '}
              <span className="font-semibold text-purple-300">
                VEEFED TECHNOLOGIES PRIVATE LIMITED
              </span>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center justify-center space-x-6 text-xs text-white/60">
              <Link 
                href="/privacy-policy" 
                className="hover:text-purple-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-white/30">•</span>
              <Link 
                href="/terms-of-service" 
                className="hover:text-purple-300 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
            
            {/* Powered by line */}
            <div className="text-xs text-white/50">
              Powered by VEEFED Technologies
            </div>
          </div>
        </div>

        {/* Mobile: Full width, no sidebar margin, extra bottom padding for mobile nav */}
        <div className="block md:hidden px-4 py-6 pb-24">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            {/* Main Copyright Line */}
            <div className="text-xs text-white/80 leading-relaxed">
              © 2025 Veefore — A product of{' '}
              <span className="font-semibold text-purple-300">
                VEEFED TECHNOLOGIES PRIVATE LIMITED
              </span>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center justify-center space-x-4 text-xs text-white/60">
              <Link 
                href="/privacy-policy" 
                className="hover:text-purple-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-white/30">•</span>
              <Link 
                href="/terms-of-service" 
                className="hover:text-purple-300 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
            
            {/* Powered by line */}
            <div className="text-xs text-white/50">
              Powered by VEEFED Technologies
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}