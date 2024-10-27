import { useState } from "react";
import { useComments } from "../hooks/useComments";
import { Avatar } from "./BlogCard";

const Comments = ({ postId }: { postId: string }) => {
  const { loading, comments, addComment } = useComments(postId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      await addComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent  resize-none"
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments List */}
    {comments.map((comment)=>(
    <div id={comment.id} className="border p-5 border-slate-200 rounded-lg ">
<div className="flex mb-2">
  <Avatar name={comment.author.name} />
  <div className="font-extralight pl-2 text-md flex justify-center flex-col">
    {comment.author.name} · {new Date(comment.createdAt).toLocaleDateString()}
  </div>
</div>
<div className="font-thin text-xl" >{comment.content}</div>
    </div>
    ))}

    </div>
  );
};
{/* <div className="border-b border-slate-200 pb-4 p-4 w-screen max-w-screen-md cursor-pointer">
<div className="flex">
  <Avatar name={authorName} />
  <div className="font-extralight pl-2 text-sm flex justify-center flex-col">
    {`${authorName} · ${createdAt}`}
  </div>
</div>
<div className="font-semibold text-xl pt-2">{title}</div>
<div className="font-thin text-md" >{content.slice(0, 100) + "..."}</div>
<div className=" text-slate-400 text-sm font-thin pt-4">{`${Math.ceil(
  content.length / 1000
)} min read`}</div>
</div> */}

export default Comments;


{/* <div className="space-y-4">
{comments.map((comment) => (
  <div key={comment.id} className="bg-gray-100 p-4 rounded">
    <div className="flex items-center ">
      <div className="mr-2">
      <Avatar name={comment.author.name} size={"small"}/> 
      </div>
    <p className="text-sm text-gray-600 font-semibold">
      {comment.author.name}
      <p className="text-sm text-gray-600"></p>
      {new Date(comment.createdAt).toLocaleDateString()}
    </p>
    </div>
    <p className="mb-2">{comment.content}</p>
  </div>
))}
</div> */}