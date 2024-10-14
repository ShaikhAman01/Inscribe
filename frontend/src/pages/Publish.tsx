import { useState } from "react";
// import { AlertCircle } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Appbar from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ToastContainer, useToast } from "../components/Toast";
import { toast } from "sonner";

const Publish = () => {
  const { showPromiseToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.info("Please fill in both the inputs");
      return;
    }
    showPromiseToast(
      async () => {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/blog`,
          {
            title,
            content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTimeout(() => {
          navigate(`/blog/${response.data.id}`);
          console.log("Publishing:", { title, content });
        }, 1000);
      },
      {
        loading: "Creating Post...",
        success: "Successfully created Post",
        error: "Error creating post. Please try again.",
      }
    );
  };

  return (
    <div>
      <Appbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Create a New Blog Post
        </h1>

        <div className="space-y-4">
          <label htmlFor="blog-title" className="sr-only">
            Blog Title
          </label>
          <input
            id="blog-title"
            type="text"
            placeholder="Enter your blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl p-2 border border-gray-300 rounded-md focus:outline-none "
          />
          {/* // export textEditor and bring as component */}
          <div className="h-72">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Write your blog content here..."
              className="h-full"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-10 ">
          <button
            onClick={handlePublish}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Publish
          </button>
          <span className="text-sm text-gray-500">
            {content.replace(/<[^>]*>/g, "").length} characters
          </span>
        </div>

        {/* Conditional Alert Message */}
        {/* {(!title.trim() || !content.trim()) && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
          role="alert"
        >
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
            <div>
              <p className="font-bold">Warning</p>
              <p className="text-sm">
                Please fill in both the title and content before publishing.
              </p>
            </div>
          </div>
        </div>
      )} */}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Publish;
