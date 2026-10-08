import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Blog, deletePost, isSignedIn, toggleLike } from "../hooks";
import { formattedDate } from "../utils/FormattedDate";
import { Avatar } from "./BlogCard";
import DOMPurify from "dompurify";
import Comments from "./Comments";
import ConfirmDialog from "./ConfirmDialog";
import { Heart, Sparkles, Loader2, Clock, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BlogPost = ({ blog }: { blog: Blog }) => {
  const navigate = useNavigate();
  const signedIn = isSignedIn();
  const [likes, setLikes] = useState(blog.likeCount);
  const [isLiked, setIsLiked] = useState(blog.likedByMe);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    if (!signedIn) {
      toast.info("Sign in to like stories");
      navigate("/signin");
      return;
    }
    const currentlyLiked = isLiked;
    setIsLiked(!currentlyLiked);
    setLikes((prev) => (currentlyLiked ? prev - 1 : prev + 1));

    try {
      const result = await toggleLike(blog.id);
      setIsLiked(result.liked);
      setLikes(result.likeCount);
    } catch {
      setIsLiked(currentlyLiked);
      setLikes((prev) => (currentlyLiked ? prev + 1 : prev - 1));
      toast.error("Failed to sync like with server");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(blog.id);
      toast.success("Story deleted");
      navigate("/blogs");
    } catch {
      toast.error("Couldn't delete this story. Please try again.");
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const generateSummary = async () => {
    if (!signedIn) {
      toast.info("Sign in to generate AI summaries");
      navigate("/signin");
      return;
    }
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
      toast.error(
        axios.isAxiosError(e) && e.response?.status === 429
          ? "You've asked for a lot of summaries. Try again in a minute."
          : "Couldn't generate a summary. Please try again.",
      );
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
                  {blog.readMinutes} min read
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-sm font-medium">by {blog.author.name || "Anonymous"}</span>
              </div>
              {blog.isMine && (
                <div className="pt-4 flex items-center gap-2">
                  <Link
                    to={`/publish?edit=${blog.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-sm font-bold text-stone-600 hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              )}
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
                  : signedIn
                  ? "Summarize with Inscribe AI"
                  : "Sign in to summarize with Inscribe AI"}
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
      <ConfirmDialog
        isVisible={confirmDelete}
        title="Delete this story?"
        description="The story, its comments and its likes will be removed permanently. This can't be undone."
        confirmLabel="Delete story"
        busy={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  );
};

export default BlogPost;