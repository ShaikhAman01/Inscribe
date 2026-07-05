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
    <Link
      to={`/blog/${id}`}
      className="block group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
    >
      <article className="p-5 sm:p-6 cursor-pointer active:scale-[0.99] transition-transform hover:bg-stone-50/50 rounded-2xl">
        {/* Header: Author & Date */}
        <div className="flex items-center gap-3">
          <Avatar name={authorName} size="big" />
          <div className="flex flex-col">
            <div className="font-bold text-stone-900 text-sm">{authorName}</div>
            <div className="text-xs text-stone-500">{createdAt}</div>
          </div>
        </div>

        {/* Body: Title & Excerpt */}
        <h2 className="font-black text-xl sm:text-2xl pt-3 text-stone-900 group-hover:text-stone-600 transition-colors tracking-tight">
          {title}
        </h2>
        <p className="font-medium text-stone-500 text-base pt-2 leading-relaxed line-clamp-3">
          {content.length > 160 ? content.slice(0, 160) + "…" : content}
        </p>

        {/* Tags Section */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {tags.map((tag) => (
              <span
                key={tag.name}
                className="flex items-center gap-1 bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
              >
                <TagIcon className="h-3 w-3" aria-hidden="true" />
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Read Time */}
        <div className="text-stone-400 text-xs font-bold pt-4 flex items-center uppercase tracking-widest">
          <Clock className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
          {`${Math.max(1, Math.ceil(content.length / 1000))} min read`}
        </div>
      </article>
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
  const safeName = typeof name === "string" && name.length > 0 ? name : "Anonymous";
  const initials = safeName[0].toUpperCase();

  const colors = ["bg-stone-800", "bg-slate-700", "bg-zinc-800", "bg-neutral-700"];
  const colorClass = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${colorClass} rounded-full shadow-sm border border-white ${
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
