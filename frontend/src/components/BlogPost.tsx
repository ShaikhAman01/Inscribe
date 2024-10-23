import { Blog } from "../hooks";
import { formattedDate } from "../utils/FormattedDate";
import { Avatar } from "./BlogCard";
import DOMPurify from "dompurify"; // To sanitize HTML content
import Comments from "./Comments";

const BlogPost = ({ blog }: { blog: Blog }) => {
  return (
    <div>
      <div className="grid grid-cols-12 xl:px-40 lg:px-20 px-5 w-full pt-10 ">
        <div className=" col-span-12 lg:col-span-8">
          <div className="text-5xl font-black">{blog.title}</div>
          <div className="pt-3 text-lg text-slate-500 font-normal">
          {formattedDate(blog.createdAt)}

          </div>
          <div
            className="pt-3 font-normal text-xl"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }} // Sanitizing and rendering the HTML
          ></div>
        </div>
        <div className=" col-span-4 pl-4">
          <div className="font-medium">Author</div>
          <div className="pt-3 flex justify-center items-center">
            <div>
              <Avatar name={blog.author.name || "Anonymous"} size="big" />
            </div>
            <div className="pl-4">
              <div className="font-extrabold text-2xl">
                {blog.author.name || "Anonymous"}
              </div>
              <div className="font-medium text-md text-slate-500 pt-3">
                Empowering others to realize life comes from within, inspiring
                self-growth and personal leadership.
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-8 xl:mx-40 lg:mx-20 mx-5 border-gray-200" />
      <div className="xl:px-40 lg:px-20 px-5 pt-10 ">
        <Comments postId={blog.id} />
      </div>
      
    </div>
  );
};

export default BlogPost;
