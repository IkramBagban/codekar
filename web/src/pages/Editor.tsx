import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LeftPanelHeader } from '@/components/editor/LeftPanelHeader';
import { ChatInput } from '@/components/editor/ChatInput';
import { ChatMessage, type ChatMessageData } from '@/components/editor/ChatMessage';
import { RightHeader } from '@/components/editor/RightHeader';
import { FileTree, type FileNode } from '@/components/editor/FileTree';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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
  const [rightTab, setRightTab] = useState<'preview' | 'code' | 'settings'>('preview');

  // --- Simple file tree model (in-memory) ---
  const filesRoot = useMemo<FileNode>(() => ({
    name: '/',
    path: '/',
    type: 'folder',
    children: [
      {
        name: 'app',
        path: 'app',
        type: 'folder',
        children: [
          {
            name: 'vanish-input',
            path: 'app/vanish-input',
            type: 'folder',
            children: [
              { name: 'page.tsx', path: 'app/vanish-input/page.tsx', type: 'file' },
            ],
          },
        ],
      },
      {
        name: 'components',
        path: 'components',
        type: 'folder',
        children: [
          {
            name: 'ui',
            path: 'components/ui',
            type: 'folder',
            children: [
              { name: 'placeholders-and-vanish-input.tsx', path: 'components/ui/placeholders-and-vanish-input.tsx', type: 'file' },
            ],
          },
        ],
      },
    ],
  }), []);

  // map path -> content (demo)
  const [fileMap, setFileMap] = useState<Record<string, string>>({
    'app/vanish-input/page.tsx': "export default function Page(){return <main className='min-h-[100dvh] flex items-center justify-center p-6'><div className='w-full max-w-3xl'>Vanish Input Page</div></main>}\n",
    'components/ui/placeholders-and-vanish-input.tsx': '// vanish input implementation here...\n',
  });

  const [selectedPath, setSelectedPath] = useState<string>(() => new URLSearchParams(location.search).get('file') || 'app/vanish-input/page.tsx');

  // keep URL in sync when selection changes
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    sp.set('file', selectedPath);
    const qp = sp.toString();
    const url = `${location.pathname}?${qp}`;
    window.history.replaceState({ ...window.history.state }, '', url);
  }, [selectedPath, location.pathname, location.search]);

  const currentCode = fileMap[selectedPath] ?? '';
  const setCurrentCode = (v: string) => {
    setFileMap((prev) => ({ ...prev, [selectedPath]: v }));
  };

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
      setFileMap((prev) => ({
        ...prev,
        [selectedPath]: (prev[selectedPath] ?? '') + `\n// Generated for: ${text}`,
      }));
    }, 1600);
  }, [input, selectedPath]);

  // Handled inside ChatInput

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100">
      <header className="border-b border-zinc-800 px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-zinc-300 hover:text-white transition-colors">← Back</Link>
        <div className="text-sm text-zinc-400">Editor</div>
      </header>

      <main className="h-[calc(100vh-65px)]">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={38} minSize={22} maxSize={78}>
            <section className="h-full border-r border-zinc-800 bg-zinc-950/60 backdrop-blur-sm flex flex-col">
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
          </ResizablePanel>

          <ResizableHandle withHandle className="hover:bg-zinc-700/50 active:bg-zinc-700/70" />

          <ResizablePanel defaultSize={62}>
            <section className="h-full flex flex-col bg-zinc-950/40">
            <RightHeader
              pathSegments={selectedPath.split('/')}
              view={rightTab}
              onChangeView={(v) => setRightTab(v)}
              onBack={() => window.history.back()}
              onForward={() => window.history.forward()}
              onShare={() => { /* TODO */ }}
              onPublish={() => { /* TODO */ }}
            />
            <div className="flex-1 min-h-0">
              {rightTab === 'preview' ? (
                <iframe
                  src="https://preview--vanish-input-wizard.lovable.app/"
                  title="Live Preview"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              ) : rightTab === 'settings' ? (
                <div className="w-full h-full bg-zinc-950 text-zinc-400 p-4">
                  <p className="text-sm">Settings panel (coming soon)…</p>
                </div>
              ) : (
                <div className="h-full flex">
                  {/* File explorer (fixed width) */}
                  <div className="h-full w-[250px] md:w-[260px] lg:w-[280px] shrink-0 border-r border-zinc-800 overflow-y-auto bg-zinc-950/50">
                    <div className="px-3 py-2 text-xs text-zinc-500 border-b border-zinc-800">Files</div>
                    <FileTree root={filesRoot} selectedPath={selectedPath} onSelect={setSelectedPath} className="p-2" />
                  </div>

                  {/* Main content (editor) */}
                  <div className="flex-1 min-w-0 h-full bg-zinc-950">
                    <CodeEditor
                      value={currentCode}
                      onChange={setCurrentCode}
                      language={selectedPath.endsWith('.tsx') ? 'typescript' : 'javascript'}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
