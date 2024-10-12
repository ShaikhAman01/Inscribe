import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";
import BlogPostSkeleton from "../components/BlogPostSkeleton";
import Appbar from "../components/Appbar";

const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "",
  });

  return (
    <div>
      <Appbar />
      <div>
        <div>{loading || !blog ? <BlogPostSkeleton /> : <BlogPost blog={blog} />}</div>
      </div>
    </div>
  );
};

export default Blog;
