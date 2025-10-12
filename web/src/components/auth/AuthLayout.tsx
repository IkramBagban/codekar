import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  error?: string;
}

export function AuthLayout({ children, title, subtitle, error }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="relative rounded-xl bg-zinc-900/80 border border-zinc-800 p-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-2xl font-semibold tracking-tight">CodeKar</span>
        </Link>

        <div className="bg-zinc-950/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">{title}</h1>
            <p className="text-sm text-zinc-400">{subtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
