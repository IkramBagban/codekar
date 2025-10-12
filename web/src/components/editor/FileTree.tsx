import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, FileCode2, Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';

export type FileNode = {
  name: string;
  path: string; // unique id
  type: 'file' | 'folder';
  children?: FileNode[];
};

type Props = {
  root: FileNode;
  selectedPath?: string;
  onSelect: (path: string) => void;
  className?: string;
};

export function FileTree({ root, selectedPath, onSelect, className }: Props) {
  return (
    <div className={cn('text-sm text-zinc-300', className)}>
      <TreeNode node={root} selectedPath={selectedPath} onSelect={onSelect} level={0} />
    </div>
  );
}

function TreeNode({ node, selectedPath, onSelect, level }: { node: FileNode; selectedPath?: string; onSelect: (p: string) => void; level: number }) {
  const [open, setOpen] = useState(true);
  const isSelected = node.path === selectedPath;
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn('flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer select-none', isSelected ? 'bg-zinc-900 border border-zinc-800' : 'hover:bg-zinc-900/40')}
        style={{ paddingLeft: 8 + level * 12 }}
        onClick={() => (node.type === 'file' ? onSelect(node.path) : setOpen(!open))}
        role="treeitem"
        aria-expanded={node.type === 'folder' ? open : undefined}
      >
        {node.type === 'folder' ? (
          <>
            {open ? <ChevronDown className="size-3.5 text-zinc-500" /> : <ChevronRight className="size-3.5 text-zinc-500" />}
            {open ? <FolderOpen className="size-4 text-zinc-400" /> : <Folder className="size-4 text-zinc-400" />}
            <span className="ml-1 truncate">{node.name}</span>
          </>
        ) : (
          <>
            <FileCode2 className="size-4 text-zinc-400" />
            <span className="ml-1 truncate">{node.name}</span>
          </>
        )}
      </div>
      {hasChildren && open && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeNode key={child.path} node={child} selectedPath={selectedPath} onSelect={onSelect} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
