import { Link } from 'react-router-dom';
import { Code2, AlertCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  error?: string;
}

export function AuthLayout({ children, title, subtitle, error }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background gradient effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and brand */}
        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 mb-8 group"
          aria-label="Go to homepage"
        >
          <div className="relative rounded-xl bg-zinc-900/80 border border-zinc-800 p-2 group-hover:border-zinc-700 transition-colors">
            <Code2 className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-2xl font-semibold tracking-tight group-hover:text-blue-400 transition-colors">
            CodeKar
          </span>
        </Link>

        {/* Main card */}
        <div className="bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-zinc-100">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400">
              {subtitle}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div 
              className="mb-6 p-3 sm:p-4 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form content */}
          {children}
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs sm:text-sm text-zinc-500">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="text-zinc-400 hover:text-zinc-300 underline transition-colors">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-zinc-400 hover:text-zinc-300 underline transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
