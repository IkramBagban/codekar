import { cn } from '@/lib/utils';

export type ChatRole = 'user' | 'assistant-thought' | 'assistant-action' | 'system';

export type ChatMessageData = {
  id: string;
  role: ChatRole;
  title?: string; // for action cards
  content: string;
  timestamp?: number;
};

type Props = {
  msg: ChatMessageData;
  className?: string;
};

export function ChatMessage({ msg, className }: Props) {
  if (msg.role === 'user') {
    return (
      <div className={cn('ml-auto max-w-[85%] rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-200', className)}>
        {msg.content}
      </div>
    );
  }

  if (msg.role === 'assistant-thought') {
    return (
      <div className={cn('mr-auto max-w-[85%] rounded-lg bg-black/40 border border-zinc-800/80 px-3 py-2 text-zinc-400 text-sm', className)}>
        {msg.content}
      </div>
    );
  }

  if (msg.role === 'assistant-action') {
    return (
      <div className={cn('mr-auto max-w-[90%] rounded-lg bg-gradient-to-br from-zinc-900/70 to-zinc-900/30 border border-zinc-800 px-0 py-0 overflow-hidden', className)}>
        {msg.title && (
          <div className="px-3 py-2 text-xs font-medium text-zinc-200 bg-zinc-950/70 border-b border-zinc-800">
            {msg.title}
          </div>
        )}
        <div className="px-3 py-2 text-zinc-300 text-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('mr-auto max-w-[85%] rounded-lg bg-zinc-900/60 border border-zinc-800/80 px-3 py-2 text-zinc-300', className)}>
      {msg.content}
    </div>
  );
}
