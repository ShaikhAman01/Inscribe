import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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

const EditBlog = () => {
  const { showPromiseToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 5000;
  const MIN_TITLE_LENGTH = 3;
  const MIN_CONTENT_LENGTH = 10;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { blogId } = useParams();

  useEffect(() => {
    const initializeBlog = async () => {
      if (!token) {
        console.log("No token found, redirecting to signup");
        navigate("/signup");
        return;
      }

      if (!blogId) {
        console.log("No blogId found");
        setError("Blog ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Fetching blog with ID: ${blogId}`);
        console.log(`Using backend URL: ${BACKEND_URL}`);
        
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${blogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Blog data received:", response.data);
        
        if (!response.data) {
          throw new Error("No data received from server");
        }

        setTitle(response.data.title || "");
        setContent(response.data.content || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error.message || "Failed to fetch blog details");
        toast.error(`Error: ${error.message || "Failed to fetch blog details"}`);
        setIsLoading(false);
      }
    };

    initializeBlog();
  }, [blogId, token, navigate]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.info("Please fill in both title and content");
      return;
    }

    if (title.length < MIN_TITLE_LENGTH) {
      toast.info("Title must be minimum 3 characters long");
      return;
    }
    if (content.length < MIN_CONTENT_LENGTH) {
      toast.info("Minimum content length is 10");
      return;
    }

    if (title.length > MAX_TITLE_LENGTH || content.length > MAX_CONTENT_LENGTH) {
      toast.error("Title or content exceeds maximum length");
      return;
    }

    showPromiseToast(
      async () => {
        const response = await axios.put(
          `${BACKEND_URL}/api/v1/blog/${blogId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTimeout(() => navigate(`/blog/${blogId}`), 1000);
      },
      {
        loading: "Updating your post...",
        success: "Post updated successfully! 🎉",
        error: "Failed to update post. Please try again.",
      }
    );
  };

  const handleSearch = () => {
    console.log("Search handler called");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading blog details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
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
            onPublish={handleUpdate}
            isPreviewMode={isPreviewMode}
          />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default EditBlog;