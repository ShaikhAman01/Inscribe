import BlogCard from "../components/BlogCard";
import Appbar from "../components/Appbar";
import { useBlogs } from "../hooks";
import BlogSkeleton from "../components/BlogSkeleton";
import { useEffect, useState } from "react";
import { formattedDate } from "../utils/FormattedDate";
import { useNavigate } from "react-router-dom";
// import { Divide } from "lucide-react";

const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const navigate = useNavigate();

  // Check for authentication
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for token
    if (!token) {
      navigate('/signup'); // Redirect to signup if not authenticated
    }
  }, [navigate]);
  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  //get current blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleSearch = (term: string) => {
    const searchedBlogs = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(term.toLowerCase()) ||
      stripHtml(blog.content).toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBlogs(searchedBlogs);
    setCurrentPage(1);
  };
  

return (
  <div className="min-h-screen bg-stone-50/50">
    <Appbar onSearch={handleSearch} />
    
    {/* Main Content */}
    <div className="flex justify-center py-10 px-4">
      <div className="grid grid-cols-12 gap-10 max-w-7xl w-full">
        
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <BlogSkeleton key={i} />)
          ) : filteredBlogs.length ? (
            currentBlogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <BlogCard
                  id={blog.id}
                  authorName={blog.author?.name || "Anonymous"}
                  title={blog.title}
                  content={stripHtml(blog.content)}
                  createdAt={formattedDate(blog.createdAt)}
                  tags={blog.tags}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
              <p className="text-stone-400 font-medium">No stories found matching your search.</p>
            </div>
          )}

        </div>

        {/* sidebar */}
        <aside className="hidden lg:block lg:col-span-4 space-y-8">
          <div className="sticky top-24">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              <h2 className="font-black text-stone-900 uppercase tracking-widest text-xs mb-4">Recommended Topics</h2>
              <div className="flex flex-wrap gap-2">
                {["Technology", "Programming", "Arch Linux", "Productivity", "Writing", "AI"].map(topic => (
                  <button key={topic} className="px-4 py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-full text-sm font-medium transition-colors">
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 px-6">
               <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">About Inscribe</p>
               <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                 A minimalist space for deep thinkers. Built with Hono, Prisma, and Cloudflare.
               </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
);
};

export default Blogs;
