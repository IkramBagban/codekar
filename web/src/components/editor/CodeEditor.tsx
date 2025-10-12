import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  language?: string;
  onChange?: (v: string) => void;
  className?: string;
  readOnly?: boolean;
};

export function CodeEditor({ value, language = 'typescript', onChange, className, readOnly }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<import('monaco-editor').editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    let disposed = false;
    let monaco: typeof import('monaco-editor') | undefined;
    async function setup() {
      const m = await import('monaco-editor');
      if (disposed) return;
      monaco = m;
      const editor = monaco.editor.create(containerRef.current!, {
        value,
        language,
        theme: 'vs-dark',
        readOnly: !!readOnly,
        automaticLayout: true,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
      });
      editorRef.current = editor;
      if (onChange) {
        editor.onDidChangeModelContent(() => {
          const v = editor.getValue();
          onChange(v);
        });
      }
    }
    setup();
    return () => {
      disposed = true;
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [language, onChange, readOnly, value]);

  // external value updates
  useEffect(() => {
    if (editorRef.current && typeof value === 'string') {
      const current = editorRef.current.getValue();
      if (current !== value) {
        editorRef.current.setValue(value);
      }
    }
  }, [value]);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
