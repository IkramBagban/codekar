import { ArrowLeft, ArrowRight, Code2, Eye, Settings, Share2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'code' | 'preview' | 'settings';

type Props = {
  pathSegments: string[];
  view: View;
  onChangeView: (v: View) => void;
  onBack: () => void;
  onForward: () => void;
  onShare?: () => void;
  onPublish?: () => void;
  className?: string;
};

export function RightHeader({ pathSegments, view, onChangeView, onBack, onForward, onShare, onPublish, className }: Props) {
  return (
    <div className={cn('px-3 md:px-4 py-2.5 border-b border-zinc-800 flex items-center gap-2 justify-between bg-zinc-950/60 backdrop-blur-sm', className)}>
      <div className="flex items-center gap-2">
        <button aria-label="Back" onClick={onBack} className="size-8 grid place-items-center rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300">
          <ArrowLeft className="size-4" />
        </button>
        <button aria-label="Forward" onClick={onForward} className="size-8 grid place-items-center rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300">
          <ArrowRight className="size-4" />
        </button>

        <div className="hidden md:flex items-center gap-1 ml-2">
          <button
            aria-label="Code view"
            onClick={() => onChangeView('code')}
            className={cn('size-8 grid place-items-center rounded-md border', view === 'code' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-800')}
          >
            <Code2 className="size-4" />
          </button>
          <button
            aria-label="Preview view"
            onClick={() => onChangeView('preview')}
            className={cn('size-8 grid place-items-center rounded-md border', view === 'preview' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-800')}
          >
            <Eye className="size-4" />
          </button>
          <button
            aria-label="Settings"
            onClick={() => onChangeView('settings')}
            className={cn('size-8 grid place-items-center rounded-md border', view === 'settings' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-800')}
          >
            <Settings className="size-4" />
          </button>
        </div>
      </div>

      <div className="min-w-0 flex-1 px-2">
        <div className="text-xs md:text-sm text-zinc-400 truncate">
          {pathSegments.length ? (
            <span>
              {pathSegments.map((seg, i) => (
                <span key={i} className="truncate">
                  {i > 0 && <span className="mx-1 text-zinc-600">›</span>}
                  <span className={i === pathSegments.length - 1 ? 'text-zinc-200' : ''}>{seg}</span>
                </span>
              ))}
            </span>
          ) : (
            <span className="text-zinc-500">No file selected</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onShare} className="px-2.5 py-1.5 text-xs rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 inline-flex items-center gap-1.5">
          <Share2 className="size-3.5" /> Share
        </button>
        <button onClick={onPublish} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-1.5">
          <Upload className="size-3.5" /> Publish
        </button>
      </div>
    </div>
  );
}
