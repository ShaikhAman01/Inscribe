import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Eye, Edit2, Send, Tag as TagIcon } from "lucide-react";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "link"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const QUILL_STYLES = `
  .ql-container.ql-snow, .ql-toolbar.ql-snow {
    border: none !important;
  }
  .ql-toolbar.ql-snow {
    border-bottom: 1px solid #f3f4f6 !important;
    padding: 0.5rem 1.5rem !important;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .ql-editor {
    font-size: 18px;
    line-height: 1.8;
    padding: 2rem 1.5rem;
    min-height: 400px;
    color: #1c1917;
  }
  .ql-editor.ql-blank::before {
    color: #d6d3d1;
    font-style: normal;
    left: 1.5rem;
  }
`;

interface TitleInputProps {
  title: string;
  setTitle: (newTitle: string) => void;
  maxLength: number;
}

export const TitleInput = ({ title, setTitle, maxLength }: TitleInputProps) => (
  <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    maxLength={maxLength}
    className="w-full text-5xl p-6 font-black border-none focus:outline-none placeholder-stone-200 text-stone-900 bg-transparent"
  />
);

interface TagInputProps {
  tags: string;
  setTags: (val: string) => void;
}

export const TagInput = ({ tags, setTags }: TagInputProps) => (
  <div className="px-6 pb-4">
    <div className="flex items-center gap-2 text-stone-400 mb-2">
      <TagIcon className="w-4 h-4" />
      <span className="text-xs font-black uppercase tracking-widest">Tags (comma separated)</span>
    </div>
    <input
      type="text"
      placeholder="technology, philosophy, life..."
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      className="w-full bg-stone-50 border border-stone-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all text-stone-700 placeholder-stone-300"
    />
  </div>
);

interface ContentEditorProps {
  content: string;
  setContent: (newContent: string) => void;
}

export const ContentEditor = ({ content, setContent }: ContentEditorProps) => (
  <div className="relative flex-grow bg-white rounded-xl overflow-hidden border border-stone-100 shadow-sm">
    <style>{QUILL_STYLES}</style>
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      modules={QUILL_MODULES}
      placeholder="Tell your story..."
      className="h-full"
    />
  </div>
);

export const ContentPreview = ({ content }: { content: string }) => (
  <div className="mt-4 bg-white rounded-xl border border-stone-100 shadow-sm min-h-[400px]">
    <div className="p-8 prose prose-stone max-w-none">
      <div
        className="preview-content blog-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  </div>
);

export const WordCount = ({ content, maxLength }: { content: string; maxLength: number }) => {
  const charCount = content.replace(/<[^>]*>/g, "").length;
  const isOver = charCount > maxLength;

  return (
    <div className={`text-xs mt-4 px-2 font-bold tracking-widest uppercase ${isOver ? "text-red-500" : "text-stone-400"}`}>
      {charCount.toLocaleString()} / {maxLength.toLocaleString()} characters
    </div>
  );
};

interface EditorActionsProps {
  onPreview: () => void;
  onPublish: () => void;
  isPreviewMode: boolean;
}

export const EditorActions = ({ onPreview, onPublish, isPreviewMode }: EditorActionsProps) => (
  <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-100">
    <button
      onClick={onPreview}
      className="flex items-center gap-2 px-6 py-3 font-bold text-stone-600 bg-stone-100 rounded-full hover:bg-stone-200 transition-all active:scale-95"
    >
      {isPreviewMode ? (
        <>
          <Edit2 className="w-4 h-4" /> Edit Story
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" /> Preview
        </>
      )}
    </button>
    <button
      onClick={onPublish}
      className="flex items-center gap-2 px-8 py-3 font-black text-white bg-stone-900 rounded-full hover:bg-stone-800 shadow-lg shadow-stone-200 transition-all active:scale-95"
    >
      <Send className="w-4 h-4" /> Publish
    </button>
  </div>
);