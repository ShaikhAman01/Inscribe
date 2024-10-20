import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Appbar from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ToastContainer, useToast } from "../components/Toast";
import { toast } from "sonner";

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 5000;

const quillStyles = `
  .ql-container.ql-snow, .ql-toolbar.ql-snow {
    border: none !important;
    overflow-y: auto;
  }
  .ql-toolbar.ql-snow {
   border: none !important;
    padding-left: 0;
  }
.ql-editor {
  font-size: 16px;
  overflow-y: auto;
  height: calc(100% - 42px); /* Adjust for toolbar height */
}

`;

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'link'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
  ]
};

const Publish = () => {
  const { showPromiseToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.info("Please fill in both the inputs");
      return;
    }

    if (title.length > MAX_TITLE_LENGTH || content.length > MAX_CONTENT_LENGTH) {
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
        loading: "Creating Post...",
        success: "Successfully created Post",
        error: "Error creating post. Please try again.",
      }
    );
  };

  const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode);

  const renderContent = () => {
    if (isPreviewMode) {
      return (
        <div
          className="p-4 bg-white rounded shadow-md overflow-y-auto"
          style={{ height: "calc(90vh - 200px)" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return (
      <div className=" flex flex-col h-full">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        placeholder="Write your blog content here..."
        modules={quillModules}
        className="h-64 mb-12 border rounded"
        style={{ height: "400px", border: "none", boxShadow: "none" }}
      />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <style>{quillStyles}</style>
      <Appbar />
      <div className="flex-grow overflow-hidden ">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
          <input
            type="text"
            placeholder="Enter your blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            className="w-full text-3xl p-3 font-bold focus:outline-none border-b border-gray-200 placeholder-gray-400 mb-4"
          />
          <div className="flex-grow overflow-hidden ">
          {renderContent()}
        <small
            className={`text-right block ${
              content.replace(/<[^>]*>/g, "").length < 3500
                ? "text-gray-500"
                : content.replace(/<[^>]*>/g, "").length <= MAX_CONTENT_LENGTH ? "text-yellow-500":"text-red-500"
            }`}
          >
            {content.replace(/<[^>]*>/g, "").length}/{MAX_CONTENT_LENGTH}
          </small>
          </div>
 
         
          <button
            onClick={togglePreviewMode}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors mr-4"
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handlePublish}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Publish
          </button>
       </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Publish;
