import { useState } from "react";
import { Blog, toggleLike } from "../hooks";
import { formattedDate } from "../utils/FormattedDate";
import { Avatar } from "./BlogCard";
import DOMPurify from "dompurify";
import Comments from "./Comments";
import { Heart, Sparkles, Loader2, Clock } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BlogPost = ({ blog }: { blog: Blog }) => {
  const [likes, setLikes] = useState(blog._count?.likes || 0);
  const [isLiked, setIsLiked] = useState(Array.isArray(blog.likes) ? blog.likes.length > 0 : false);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const readingTime = Math.max(
    1,
    Math.ceil(blog.content.replace(/<[^>]*>/g, "").length / 1000)
  );

  const handleLike = async () => {
    const currentlyLiked = isLiked;
    setIsLiked(!currentlyLiked);
    setLikes(prev => currentlyLiked ? prev - 1 : prev + 1);

    try {
      await toggleLike(blog.id);
    } catch {
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
      toast.error("Couldn't generate a summary. Please try again.");
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
    .blog-content a { text-decoration: underline; text-underline-offset: 2px; }
    .blog-content img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; }
    .blog-content blockquote { border-left: 3px solid #d6d3d1; padding-left: 1rem; color: #57534e; font-style: italic; margin-bottom: 1rem; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
  `;

  return (
    <div>
      <style>{containerStyle}</style>
      <div className="grid grid-cols-12 xl:px-40 lg:px-20 px-5 w-full pt-10">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight break-words">
                {blog.title}
              </h1>
              <div className="pt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-500">
                <span>{formattedDate(blog.createdAt)}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {readingTime} min read
                </span>
              </div>
            </div>
            <button
              onClick={handleLike}
              aria-label={isLiked ? "Unlike this story" : "Like this story"}
              aria-pressed={isLiked}
              className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-500 shadow-sm"
                  : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} aria-hidden="true" />
              <span className="font-bold">{likes}</span>
            </button>
          </div>

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
            className="pt-10 blog-content text-stone-800 text-lg break-words"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </div>

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