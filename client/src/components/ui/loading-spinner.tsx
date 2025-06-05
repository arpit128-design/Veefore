export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-4 border-electric-cyan/30 border-t-electric-cyan ${className}`} />
  );
}

export function LoadingOrbit({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full border-3 border-electric-cyan/30 border-t-electric-cyan ${className}`} />
  );
}
