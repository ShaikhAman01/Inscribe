import { Clock, Tag as TagIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  tags?: { name: string }[];
}

const BlogCard = ({
  id,
  authorName,
  title,
  content,
  createdAt,
  tags
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`} className="block group">
      <div className="border-b border-stone-100 pb-6 mb-6 p-4 w-screen max-w-screen-lg cursor-pointer active:scale-[0.99] transition-transform hover:bg-stone-50/50 rounded-2xl">
        {/* Header: Author & Date */}
        <div className="flex items-center gap-3">
          <Avatar name={authorName} size="big" />
          <div className="flex flex-col">
            <div className="font-bold text-stone-900 text-sm">{authorName}</div>
            <div className="text-xs text-stone-500">{createdAt}</div>
          </div>
        </div>

        {/* Body: Title & Excerpt */}
        <div className="font-black text-2xl pt-3 text-stone-900 group-hover:text-stone-600 transition-colors tracking-tight">
          {title}
        </div>
        <div className="font-medium text-stone-500 text-md pt-2 leading-relaxed">
          {content.slice(0, 160) + "..."}
        </div>

        {/* Tags Section */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {tags.map((tag, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
              >
                <TagIcon className="h-3 w-3" />
                {tag.name}
              </div>
            ))}
          </div>
        )}

        {/* Footer: Read Time */}
        <div className="text-stone-400 text-xs font-bold pt-4 flex items-center uppercase tracking-widest">
          <Clock className="h-3.5 w-3.5 mr-2" />
          {`${Math.max(1, Math.ceil(content.length / 1000))} min read`}
        </div>
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
  // Safety check: ensure name is a string to prevent "can't convert to string" error
  const safeName = typeof name === 'string' ? name : "Anonymous";
  const initials = safeName.length > 0 ? safeName[0].toUpperCase() : "U";
  
  const colors = ["bg-stone-800", "bg-slate-700", "bg-zinc-800", "bg-neutral-700"];
  const colorClass = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden ${colorClass} rounded-full shadow-sm border border-white ${
        size === "small" ? "w-8 h-8" : "w-10 h-10"
      }`}
    >
      <span
        className={`${size === "small" ? "text-xs" : "text-sm"} font-bold text-stone-100`}
      >
        {initials}
      </span>
    </div>
  );
}

export default BlogCard;