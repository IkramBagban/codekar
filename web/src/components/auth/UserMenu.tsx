import { useAuth } from '@/lib/use-auth';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/signin"
          className="text-sm text-zinc-300 hover:text-white transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <User className="w-4 h-4 text-blue-400" />
        </div>
        <span className="text-sm text-zinc-300 hidden md:inline">{user.name}</span>
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-2xl py-2">
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-sm font-medium text-zinc-200">{user.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
          </div>
          
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-colors"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-zinc-800/50 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
