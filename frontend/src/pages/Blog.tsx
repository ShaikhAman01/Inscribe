import { usePageTitle } from "../hooks/usePageTitle";
import { useBlog } from "../hooks";
import { Link, useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import BlogPostSkeleton from "../components/BlogPostSkeleton";
import Appbar from "../components/Appbar";
import { FileQuestion } from "lucide-react";

const Blog = () => {
  const { id } = useParams();
  const { loading, blog, notFound } = useBlog({
    id: id || "",
  });
  usePageTitle(notFound ? "Story not found" : blog?.title);

  return (
    <div>
      <Appbar />
      <main className="mb-10">
        {loading ? (
          <BlogPostSkeleton />
        ) : notFound || !blog ? (
          <div className="flex flex-col items-center text-center py-24 px-6">
            <FileQuestion className="w-12 h-12 text-stone-300 mb-6" aria-hidden="true" />
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Story not found</h1>
            <p className="text-stone-500 mt-2 max-w-sm">
              It may have been deleted by its author, or the link is incorrect.
            </p>
            <Link
              to="/blogs"
              className="mt-8 px-8 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
            >
              Browse stories
            </Link>
          </div>
        ) : (
          <BlogPost blog={blog} />
        )}
      </main>
    </div>
  );
};

export default Blog;
