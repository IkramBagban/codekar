import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type Message = { id: string; role: 'user' | 'assistant' | 'system'; content: string };

export default function EditorPage() {
  const location = useLocation();
  const initialPrompt = useMemo(() => {
    try {
      // state wins
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const s = (location.state as any)?.prompt;
      if (typeof s === 'string' && s.length) return s;
    } catch {}
    // fallback to query param
    const qp = new URLSearchParams(location.search).get('q');
    return typeof qp === 'string' ? qp : '';
  }, [location.state, location.search]);

  const [messages, setMessages] = useState<Message[]>(() =>
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
  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: text },
    ]);
    setInput('');

    // Placeholder: Simulate assistant echo and code update
    setTimeout(() => {
      const reply = `You said: "${text}"`;
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: reply },
      ]);
      setCode((c) => `${c}\n// TODO: Implement for: ${text}`);
    }, 400);
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === 'Enter' && !e.shiftKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

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
            className="h-full border-r border-zinc-800 bg-zinc-950/60 backdrop-blur-sm"
            style={{ width: `${leftPct}%` }}
          >
            <div className="h-full flex flex-col">
              <div className="px-4 py-3 border-b border-zinc-800 text-sm text-zinc-300">Chat</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-zinc-500">Type a prompt to get started.</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={
                        m.role === 'user'
                          ? 'ml-auto max-w-[85%] rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-200'
                          : 'mr-auto max-w-[85%] rounded-lg bg-zinc-900/60 border border-zinc-800/80 px-3 py-2 text-zinc-300'
                      }
                    >
                      {m.content}
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-zinc-800">
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Ask CodeKar…"
                    className="flex-1 min-h-[44px] max-h-40 bg-black/60 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-700 focus:border-zinc-700 resize-y"
                  />
                  <button
                    onClick={sendMessage}
                    className="h-[44px] px-3 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 disabled:opacity-50"
                    disabled={!input.trim()}
                  >
                    Send
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-zinc-500">Press Enter to send • Shift+Enter for new line</p>
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
