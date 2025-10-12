import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LeftPanelHeader } from '@/components/editor/LeftPanelHeader';
import { ChatInput } from '@/components/editor/ChatInput';
import { ChatMessage, type ChatMessageData } from '@/components/editor/ChatMessage';

// message type is provided by ChatMessageData; no local Message needed

export default function EditorPage() {
  const location = useLocation();
  const initialPrompt = useMemo(() => {
    try {
      // state wins
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const s = (location.state as any)?.prompt;
      if (typeof s === 'string' && s.length) return s;
    } catch {
      /* ignore */
    }
    // fallback to query param
    const qp = new URLSearchParams(location.search).get('q');
    return typeof qp === 'string' ? qp : '';
  }, [location.state, location.search]);

  const [messages, setMessages] = useState<ChatMessageData[]>(() =>
    initialPrompt
      ? [{ id: crypto.randomUUID(), role: 'user', content: initialPrompt }]
      : []
  );
  const [input, setInput] = useState('');
  const [rightTab, setRightTab] = useState<'preview' | 'code'>('preview');
  const [code, setCode] = useState<string>(
    "// Generated code will appear here...\nfunction hello() {\n  console.log('Hello, CodeKar!');\n}"
  );

  // --- Resizable logic ---
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [leftPct, setLeftPct] = useState(38); // initial left width %

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const pct = (relativeX / rect.width) * 100;
    const clamped = Math.min(78, Math.max(22, pct));
    setLeftPct(clamped);
  }, []);

  const stopDragging = useCallback(() => {
    draggingRef.current = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', stopDragging);
  }, [onMouseMove]);

  const startDragging = useCallback(() => {
    draggingRef.current = true;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);
  }, [onMouseMove, stopDragging]);

  useEffect(() => {
    return () => {
      // cleanup just in case
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [onMouseMove, stopDragging]);

  // --- Chat send ---
  const feedRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    const el = feedRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: text },
    ]);
    setInput('');

    // Simulate assistant thought and action updates
    const thoughtId = crypto.randomUUID();
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: thoughtId, role: 'assistant-thought', content: 'Thought for 3s' } as ChatMessageData,
      ]);
    }, 300);

    setTimeout(() => {
      // replace thought with action card and update code
      setMessages((prev) =>
        prev.map(m => (m.id === thoughtId ? { ...m, role: 'assistant-action', title: 'Added vanish input demo v1', content: 'The vanish-on-submit input is now available at /vanish-input. Structure is clean with primitives in components/ui and a demo wrapper. Uses motion/react and our cn utility.' } as ChatMessageData : m))
      );
      setCode((c) => `${c}\n// Generated for: ${text}`);
    }, 1600);
  }, [input]);

  // Handled inside ChatInput

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100">
      <header className="border-b border-zinc-800 px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-zinc-300 hover:text-white transition-colors">← Back</Link>
        <div className="text-sm text-zinc-400">Editor</div>
      </header>

      <main ref={containerRef} className="h-[calc(100vh-65px)] relative select-none">
        <div className="absolute inset-0 flex">
          {/* Left: Chat */}
          <section
            className="h-full border-r border-zinc-800 bg-zinc-950/60 backdrop-blur-sm flex flex-col"
            style={{ width: `${leftPct}%` }}
          >
            <LeftPanelHeader projectName="React component integration" onViewProjectHref="#" />
            <div ref={feedRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-zinc-500">Type a prompt to get started.</p>
              ) : (
                messages.map((m) => <ChatMessage key={m.id} msg={m as ChatMessageData} />)
              )}
            </div>
            <div className="px-3 pb-2 border-t border-zinc-800">
              <ChatInput value={input} onChange={setInput} onSubmit={sendMessage} placeholder="Ask a follow-up…" />
            </div>
            <div className="mt-auto">
              <div className="sticky bottom-0">
                <div className="px-3 py-2 border-t border-zinc-800 bg-zinc-950/70 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="px-2.5 py-1.5 text-xs rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300">Design</button>
                  </div>
                  <button className="px-2.5 py-1.5 text-xs rounded-md bg-blue-600 hover:bg-blue-700 text-white">Upgrade Plan</button>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div
            role="separator"
            aria-orientation="vertical"
            onMouseDown={startDragging}
            className="w-1.5 cursor-col-resize bg-transparent hover:bg-zinc-700/50 active:bg-zinc-700/70"
            title="Drag to resize"
          />

          {/* Right: Code/Preview */}
          <section className="h-full flex-1 bg-zinc-950/40">
            <div className="h-full grid grid-rows-[auto,1fr]">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                <button
                  onClick={() => setRightTab('preview')}
                  className={
                    rightTab === 'preview'
                      ? 'px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200'
                      : 'px-3 py-1.5 rounded-md bg-transparent border border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                  }
                >
                  Preview
                </button>
                <button
                  onClick={() => setRightTab('code')}
                  className={
                    rightTab === 'code'
                      ? 'px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200'
                      : 'px-3 py-1.5 rounded-md bg-transparent border border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                  }
                >
                  Code
                </button>
              </div>
              <div className="p-4 overflow-auto">
                {rightTab === 'preview' ? (
                  <div className="w-full min-h-[60vh] h-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-400">
                    <p className="mb-2">Live preview will render here.</p>
                    {messages.length > 0 && (
                      <>
                        <p className="text-zinc-500 text-sm mb-2">Latest prompt:</p>
                        <div className="rounded-md border border-zinc-800 bg-black/50 p-3 text-zinc-300">
                          {messages[messages.length - 1].content}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full min-h-[60vh] h-full bg-zinc-950 border border-zinc-800 rounded-lg">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-full bg-transparent text-zinc-100 p-4 font-mono text-sm outline-none resize-none"
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
