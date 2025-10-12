import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export function LeftFooter({ className }: Props) {
  return (
    <div className={cn('px-3 py-2 border-t border-zinc-800 bg-zinc-950/70 backdrop-blur-sm flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        <button className="px-2.5 py-1.5 text-xs rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300">
          Design
        </button>
      </div>
      <button className="px-2.5 py-1.5 text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white">
        Upgrade Plan
      </button>
    </div>
  );
}
