import { useState } from "react";
import { useComments } from "../hooks/useComments";
import { Avatar } from "./BlogCard";
import { ToastContainer } from "./Toast";
import { toast } from "sonner";
import { Loader2, MessageCircle } from "lucide-react";
import { formattedDate } from "../utils/FormattedDate";

const Comments = ({ postId }: { postId: string }) => {
  const { loading, comments, addComment } = useComments(postId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.info("Write something to post");
      return;
    }
    setIsSubmitting(true);

    try {
      await addComment(newComment.trim());
      setNewComment("");
      toast.success("Comment posted");
    } catch (error) {
      console.error("Failed to post comment", error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-black text-stone-900 tracking-tight">
        Comments{!loading && comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <label htmlFor="comment-input" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-3 border-b border-stone-200 focus:border-stone-900 focus:outline-none transition-colors duration-150 resize-none bg-transparent placeholder-stone-400"
          rows={2}
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-bold hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
          {newComment.length > 0 && (
            <span className="text-xs font-bold text-stone-400 tracking-wider">
              {newComment.length}/500
            </span>
          )}
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-6 animate-pulse" aria-label="Loading comments">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-stone-200 rounded-full shrink-0"></div>
              <div className="flex-grow space-y-2 pt-1">
                <div className="h-3.5 bg-stone-200 rounded w-32"></div>
                <div className="h-4 bg-stone-100 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center text-center py-10 text-stone-400">
          <MessageCircle className="w-8 h-8 mb-3 text-stone-300" aria-hidden="true" />
          <p className="font-bold text-stone-500">No comments yet</p>
          <p className="text-sm mt-1">Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={comment.author.name} />
              <div className="min-w-0">
                <div className="text-sm text-stone-500">
                  <span className="font-bold text-stone-900">{comment.author.name}</span>
                  {" · "}
                  {formattedDate(comment.createdAt)}
                </div>
                <p className="text-stone-700 leading-relaxed mt-1 break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </section>
  );
};

export default Comments;
