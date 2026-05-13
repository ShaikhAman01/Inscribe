import { useState } from "react";
import { Blog, toggleLike } from "../hooks";
import { formattedDate } from "../utils/FormattedDate";
import { Avatar } from "./BlogCard";
import DOMPurify from "dompurify";
import Comments from "./Comments";
import { Heart, Sparkles, Loader2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BlogPost = ({ blog }: { blog: Blog }) => {
  const [likes, setLikes] = useState(blog._count?.likes || 0);
  const [isLiked, setIsLiked] = useState(blog.likes?.length > 0);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

const handleLike = async () => {
  const currentlyLiked = isLiked;
  setIsLiked(!currentlyLiked);
  setLikes(prev => currentlyLiked ? prev - 1 : prev + 1);

  try {
    await toggleLike(blog.id);
  } catch (e) {
    setIsLiked(currentlyLiked);
    setLikes(prev => currentlyLiked ? prev + 1 : prev - 1);
    toast.error("Failed to sync like with server");
  }
};

  const generateSummary = async () => {
    setIsSummarizing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/blog/summarize/${blog.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSummary(res.data.summary);
    } catch (e) {
      console.error("AI summarization failed", e);
    } finally {
      setIsSummarizing(false);
    }
  };

  const containerStyle = `
    .blog-content h1 { font-size: 2em; font-weight: bold; margin-bottom: 1rem; }
    .blog-content h2 { font-size: 1.75em; font-weight: bold; margin-bottom: 0.75rem; }
    .blog-content p { margin-bottom: 1rem; line-height: 1.75; }
    .blog-content ul, .blog-content ol { margin-left: 1.5rem; margin-bottom: 1rem; }
    .blog-content li { margin-bottom: 0.5rem; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
  `;

  return (
    <div>
      <style>{containerStyle}</style>
      <div className="grid grid-cols-12 xl:px-40 lg:px-20 px-5 w-full pt-10">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-stone-900">
                {blog.title}
              </h1>
              <p className="pt-3 text-lg text-slate-500 font-normal">
                {formattedDate(blog.createdAt)}
              </p>
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-500 shadow-sm"
                  : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-bold">{likes}</span>
            </button>
          </div>

          {/* Tag List */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-5">
              {blog.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* AI Summary Section */}
          <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 shadow-sm">
            {!summary ? (
              <button
                onClick={generateSummary}
                disabled={isSummarizing}
                className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSummarizing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isSummarizing
                  ? "Architecting Summary..."
                  : "Summarize with Inscribe AI"}
              </button>
            ) : (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                    AI Generated Insight
                  </span>
                </div>
                <p className="text-stone-700 leading-relaxed text-lg italic font-medium">
                  "{summary}"
                </p>
              </div>
            )}
          </div>

          <div
            className="pt-10 blog-content text-stone-800"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </div>

        {/* Author Sidebar */}
        <div className="col-span-12 lg:col-span-4 lg:pl-12 pt-10 lg:pt-0">
          <div className="sticky top-24">
            <div className="text-stone-500 font-bold text-sm uppercase tracking-widest border-b border-stone-100 pb-2 mb-4">
              Author
            </div>
            <div className="flex items-start gap-4">
              <Avatar name={blog.author.name || "Anonymous"} size="big" />
              <div>
                <div className="font-black text-xl text-stone-900">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="font-medium text-sm text-stone-500 pt-2 leading-relaxed">
                  Passionate storyteller and developer. Sharing insights on
                  technology, life, and inner growth.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-12 xl:mx-40 lg:mx-20 mx-5 border-stone-100" />
      <div className="xl:px-40 lg:px-20 px-5 pb-20">
        <Comments postId={blog.id} />
      </div>
    </div>
  );
};

export default BlogPost;
