"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "כתבו תיאור מפורט למוצר...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-relaxed focus:outline-none prose prose-slate max-w-none",
        dir: "rtl",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[180px] rounded-lg border border-border bg-surface-alt px-4 py-3 text-sm text-text-secondary">
        טוען עורך...
      </div>
    );
  }

  const tools = [
    { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { label: "•", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { label: "1.", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={tool.action}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
              tool.active
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-text-primary hover:bg-surface-alt",
            )}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
