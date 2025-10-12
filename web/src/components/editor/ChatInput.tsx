import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { useRef } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
};

export function ChatInput({ value, onChange, onSubmit, placeholder = 'Ask a follow-up…', className }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={cn('rounded-md border border-zinc-800 bg-black/60 p-2', className)}>
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 min-h-[44px] max-h-40 bg-transparent text-zinc-100 placeholder:text-zinc-500 outline-none resize-y text-sm px-2 py-1"
        />
        <button
          onClick={onSubmit}
          className="inline-flex items-center justify-center h-[40px] w-[40px] rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 disabled:opacity-50"
          disabled={!value.trim()}
          aria-label="Send message"
        >
          <ArrowUp className="size-4" />
        </button>
      </div>
      <p className="mt-1 text-[11px] text-zinc-500">Enter to send • Shift+Enter for new line</p>
    </div>
  );
}
