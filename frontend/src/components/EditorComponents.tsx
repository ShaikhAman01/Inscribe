
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Eye, Edit2, Send } from "lucide-react";

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
    overflow-y: auto;
  }
  .ql-toolbar.ql-snow {
    border-bottom: 1px solid #e5e7eb !important;
    padding-left: 0;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .ql-editor {
    font-size: 16px;
    line-height: 1.75;
    padding: 1.5rem;
    min-height: calc(100vh - 400px);
  }
  .ql-editor p {
    margin-bottom: 1rem;
  }
  .ql-editor h1, .ql-editor h2, .ql-editor h3 {
    margin: 1.5rem 0 1rem;
    font-weight: 600;
  }
`;

interface TitleInput{
   title:string, 
   setTitle:(newTitle: string) => void, 
   maxLength:number, 
}

interface ContentEditor{
    content:string,
    setContent:(newContent: string) => void;
}


export const TitleInput = ({ title, setTitle, maxLength }:TitleInput) => (
  <input
    type="text"
    placeholder="Enter your blog title..."
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    maxLength={maxLength}
    className="w-full text-3xl p-6 font-bold border-none focus:outline-none rounded-lg placeholder-gray-400"
  />
);

export const ContentEditor = ({ content, setContent }:ContentEditor) => (
  <div className="relative flex-grow bg-white rounded-lg">
    <style>{QUILL_STYLES}</style>
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      modules={QUILL_MODULES}
      placeholder="Start writing your post..."
      className="h-full"
    />
  </div>
);

interface ContentPreviewProps {
  content: string;
}

export const ContentPreview =  ({ content }: ContentPreviewProps) => (
  <div className="mt-4 rounded-lg shadow-sm">
    <div className="p-6 prose max-w-none">
      <div
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  </div>
);

interface WordCount{
    content:string,
    maxLength:number
}

export const WordCount = ({ content, maxLength }:WordCount) => {
  const wordCount = content.replace(/<[^>]*>/g, "").length;
  const getCountColor = () => {
    if (wordCount > maxLength) return "text-red-500";
    if (wordCount > maxLength * 0.7) return "text-yellow-500";
    return "text-gray-500";
  };

  return (
    <div className={`text-sm mt-2 text-right ${getCountColor()}`}>
      {wordCount.toLocaleString()} / {maxLength.toLocaleString()} characters
    </div>
  );
};


interface EditorActionsProps {
    onPreview: () => void; 
    onPublish: () => void; 
    isPreviewMode: boolean; 
  }

export const EditorActions = ({ onPreview, onPublish, isPreviewMode }:EditorActionsProps) => (
  <div className="flex gap-4 mt-6">
    <button
      onClick={onPreview}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
    >
      {isPreviewMode ? (
        <>
          <Edit2 className="w-4 h-4" /> Edit
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" /> Preview
        </>
      )}
    </button>
    <button
      onClick={onPublish}
      className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Send className="w-4 h-4" /> Publish
    </button>
  </div>
);