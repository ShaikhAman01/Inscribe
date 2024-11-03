// Publish.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Appbar from "../components/Appbar";
import { ToastContainer, useToast } from "../components/Toast";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

import {
  TitleInput,
  ContentEditor,
  ContentPreview,
  WordCount,
  EditorActions,
} from "../components/EditorComponents";

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 5000;



const Publish = () => {
  const { showPromiseToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/signup'); // Redirect to signup if not authenticated
    }
  }, [navigate]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.info("Please fill in both title and content");
      return;
    }

    if (
      title.length > MAX_TITLE_LENGTH ||
      content.length > MAX_CONTENT_LENGTH
    ) {
      toast.error("Title or content exceeds maximum length");
      return;
    }

    showPromiseToast(
      async () => {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/blog`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTimeout(() => navigate(`/blog/${response.data.id}`), 1000);
      },
      {
        loading: "Creating your post...",
        success: "Post published successfully! 🎉",
        error: "Failed to publish post. Please try again.",
      }
    );
  };

  const containerStyle = `
    .preview-content h1 {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .preview-content h2 {
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 0.75rem;
    }
    .preview-content h3 {
      font-size: 1.25em;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .preview-content p {
      margin-bottom: 1rem;
      line-height: 1.75;
    }
    .preview-content ul, .preview-content ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .preview-content li {
      margin-bottom: 0.5rem;
    }
  `;

  const handleSearch = () =>{
    console.log("to avoid errors")
  }
  return (
    <div className="min-h-screen bg-stone-50">
      <style>{containerStyle}</style>
      <Appbar onSearch={handleSearch} />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-5xl">
          <TitleInput
            title={title}
            setTitle={setTitle}
            maxLength={MAX_TITLE_LENGTH}
          />

          <div className="mt-6">
            {isPreviewMode ? (
              <ContentPreview content={content} />
            ) : (
              <ContentEditor content={content} setContent={setContent} />
            )}
            <WordCount content={content} maxLength={MAX_CONTENT_LENGTH} />
          </div>

          <EditorActions
            onPreview={() => setIsPreviewMode(!isPreviewMode)}
            onPublish={handlePublish}
            isPreviewMode={isPreviewMode}
          />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Publish;
