import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
}
const BlogCard = ({
  id,
  authorName,
  title,
  content,
  createdAt,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="border-b border-slate-200 pb-4 mb-4 p-4 w-screen max-w-screen-lg cursor-pointer shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3">
          <Avatar name={authorName} size="big" />
          <div>
            <div className="font-medium">{`${authorName}`}</div>
            <div className="text-sm text-stone-600">{`${createdAt}`}</div>
          </div>
          {/* <div className="font-normal pl-2 text-sm flex justify-center flex-col">
            {`${authorName} · ${createdAt}`}
          </div> */}
        </div>

        <div className="font-bold text-xl pt-2 group-hover:text-stone-600 transition-colors">
          {title}
        </div>
        <div className="font-thin text-md ">
          {content.slice(0, 120) + " ..."}
        </div>
        <div className=" text-slate-400 text-sm font-thin pt-4 flex items-center"><Clock className="h-4 w-4 mr-2"/>{`${Math.ceil(
          content.length / 1000
        )}  min read`}</div>
      </div>
    </Link>
  );
};

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  const initials = name && name.length > 0 ? name[0].toUpperCase() : "U";
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
        size === "small" ? "w-8 h-8" : "w-10 h-10"
      }`}
    >
      <span
        className={`${size === "small" ? "text-xs" : "text-md"} text-gray-300`}
      >
        {initials}
      </span>
    </div>
  );
}

export default BlogCard;
