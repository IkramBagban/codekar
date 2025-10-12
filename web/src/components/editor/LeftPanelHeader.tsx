import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  projectName: string;
  onViewProjectHref?: string;
  className?: string;
};

export function LeftPanelHeader({ projectName, onViewProjectHref = '#', className }: Props) {
  return (
    <div className={cn('px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70 backdrop-blur-sm', className)}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="size-2.5 rounded-sm bg-gradient-to-br from-violet-500 to-blue-500" />
        <h2 className="text-sm font-medium text-zinc-200 truncate" title={projectName}>{projectName}</h2>
      </div>
      <a
        href={onViewProjectHref}
        className="group inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        View Project
        <ExternalLink className="size-3.5 opacity-70 group-hover:opacity-100" />
      </a>
    </div>
  );
}
