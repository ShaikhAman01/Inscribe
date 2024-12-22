// import { Blog } from "../hooks";
import { formattedDate } from "../utils/FormattedDate";
import { Avatar } from "./BlogCard";
import DOMPurify from "dompurify";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";

const BlogPost = ({ blog }: { blog: { id: string, title: string, createdAt: string, content: string, author: { id: string, name: string } } }) => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/blog/${blog.id}/edit`);
  }

  const containerStyle = `
    .blog-content h1 {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .blog-content h2 {
      font-size: 1.75em;
      font-weight: bold;
      margin-bottom: 0.75rem;
    }
    .blog-content h3 {
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .blog-content p {
      margin-bottom: 1rem;
      line-height: 1.75;
    }
    .blog-content ul, .blog-content ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .blog-content li {
      margin-bottom: 0.5rem;
    }
  `;

  return (
    <div>
      <style>{containerStyle}</style>
      <div className="grid grid-cols-12 xl:px-40 lg:px-20 px-5 w-full pt-10">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="text-4xl font-black">{blog.title}</h1>
          <p className="pt-3 text-lg text-slate-500 font-normal">
            {formattedDate(blog.createdAt)}
          </p>
          <div
            className="pt-3 blog-content"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
          <div>
            {blog.author.id == userId && (
              <button onClick={handleEdit} className="bg-slate-950 text-white px-4 py-2 rounded-lg mt-5">
                Edit
              </button>
            )}
          </div>
        </div>
        <div className=" col-span-4 pl-4 sm:pt-10">

<div className="font-medium">Author</div>

<div className="pt-3 flex justify-center items-center pl-5 md:pl-0">

  <div className="pl-16 md:pl-0">

    <Avatar name={blog.author.name || "Anonymous"} size="big" />

  </div>

  <div className="pl-4">

    <div className="font-extrabold text-2xl">

      {blog.author.name || "Anonymous"}

    </div>

    <div className="font-medium text-md text-slate-500 pt-3 min-w-44 md:min-w-0 ">

      Empowering others to realize life comes from within, inspiring

      self-growth and personal leadership.

    </div>

  </div>

</div>

</div>
      </div>
      <hr className="my-8 xl:mx-40 lg:mx-20 mx-5 border-gray-200" />
      <div className="xl:px-40 lg:px-20 px-5 pt-10">
        <Comments postId={blog.id} />
      </div>
    </div>
  );
};

export default BlogPost;
