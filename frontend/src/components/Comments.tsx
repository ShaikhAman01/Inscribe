import { useComments } from '../hooks/useComments';

const Comments = ({ postId }: { postId: string }) => {
  const { loading, comments } = useComments(postId);

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-100 p-4 rounded">
          <p className="mb-2">{comment.content}</p>
          <p className="text-sm text-gray-600">
            By {comment.author.name} on {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Comments;