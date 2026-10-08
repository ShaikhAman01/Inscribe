import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  TagInput,
} from "../components/EditorComponents";


const Publish = () => {
  const { showPromiseToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 5000;
  const MIN_TITLE_LENGTH = 3;
  const MIN_CONTENT_LENGTH = 10;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loadingPost, setLoadingPost] = useState(Boolean(editId));

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!editId || !token) return;
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${editId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (!data.post?.isMine) {
          toast.error("You can only edit your own stories");
          navigate(`/blog/${editId}`);
          return;
        }
        setTitle(data.post.title);
        setContent(data.post.content);
        setTags(data.post.tags.map((t: { name: string }) => t.name).join(", "));
      })
      .catch(() => {
        toast.error("Couldn't load that story");
        navigate("/blogs");
      })
      .finally(() => setLoadingPost(false));
  }, [editId, token, navigate]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.info("Please fill in both title and content");
      return;
    }

    if (title.length < MIN_TITLE_LENGTH) {
      toast.info(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
      return;
    }
    if (content.length < MIN_CONTENT_LENGTH) {
      toast.info(`Content must be at least ${MIN_CONTENT_LENGTH} characters`);
      return;
    }

    if (
      title.length > MAX_TITLE_LENGTH ||
      content.length > MAX_CONTENT_LENGTH
    ) {
      toast.error("Title or content exceeds maximum length");
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    setIsPublishing(true);
    showPromiseToast(
      async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const response = editId
            ? await axios.put(`${BACKEND_URL}/api/v1/blog`, { id: editId, title, content, tags: tagsArray }, { headers })
            : await axios.post(`${BACKEND_URL}/api/v1/blog`, { title, content, tags: tagsArray }, { headers });
          setTimeout(() => navigate(`/blog/${response.data.id}`), 1000);
        } catch (error) {
          setIsPublishing(false);
          throw error;
        }
      },
      {
        loading: editId ? "Saving your changes..." : "Creating your post...",
        success: editId ? "Changes saved" : "Post published successfully! 🎉",
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

  return (
    <div className="min-h-screen bg-stone-50">
      <style>{containerStyle}</style>
      <Appbar />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-5xl">
          <TitleInput
            title={title}
            setTitle={setTitle}
            maxLength={MAX_TITLE_LENGTH}
          />
          <TagInput tags={tags} setTags={setTags} />

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
            isPublishing={isPublishing || loadingPost}
            isEditing={Boolean(editId)}
          />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Publish;
