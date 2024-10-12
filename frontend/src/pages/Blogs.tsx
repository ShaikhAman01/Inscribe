import BlogCard from "../components/BlogCard";
import Appbar from "../components/Appbar";
import { useBlogs } from "../hooks";
import BlogSkeleton from "../components/BlogSkeleton";
import { Divide } from "lucide-react";

const Blogs = () => {
  const { loading, blogs } = useBlogs();

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  // if (loading) {
  //   return <div className="flex justify-center mt-10">
  //     <BlogSkeleton/>
  //     <BlogSkeleton/>
  //     <BlogSkeleton/>
  //     <BlogSkeleton/>
  //     <BlogSkeleton/>
  //     </div>;
  // }

  // if (!blogs.length) {
  //   return <div>No blogs available</div>;
  // }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))
          ) : blogs.length ? (
            blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                authorName={blog.author?.name || "Anonymous"}
                title={blog.title}
                content={stripHtml(blog.content)}
                publishedDate={"2nd Feb 2024"}
              />
            ))
          ) : (
            <div>No Blogs Available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
