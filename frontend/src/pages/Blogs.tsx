import BlogCard from "../components/BlogCard";
import Appbar from "../components/Appbar";
import { useBlogs } from "../hooks";
import BlogSkeleton from "../components/BlogSkeleton";
import { useEffect, useState } from "react";
import { formattedDate } from "../utils/FormattedDate";
import { useNavigate } from "react-router-dom";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";

const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signup');
    }
  }, [navigate]);

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  const stripHtml = (html: string) => {
    if (typeof html !== 'string') return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleSearch = (term: string) => {
    if (!term || typeof term !== 'string' || !term.trim()) {
      setFilteredBlogs(blogs);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const searchedBlogs = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(lowerTerm) ||
      blog.tags?.some(tag => tag.name.toLowerCase().includes(lowerTerm)) ||
      stripHtml(blog.content).toLowerCase().includes(lowerTerm)
    );
    
    setFilteredBlogs(searchedBlogs);
    setCurrentPage(1); 
  };

  return (
    <div className="min-h-screen bg-stone-50/50">
      <Appbar onSearch={handleSearch} />
      
      <main className="flex justify-center py-10 px-4">
        <div className="grid grid-cols-12 gap-10 max-w-7xl w-full">
          
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <BlogSkeleton key={i} />)
            ) : (
              <>
                {filteredBlogs.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {currentBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all hover:border-stone-200">
                          <BlogCard
                            id={blog.id}
                            authorName={blog.author?.name || "Anonymous"}
                            title={blog.title}
                            content={stripHtml(blog.content)}
                            createdAt={formattedDate(blog.createdAt)}
                            tags={blog.tags}
                          />
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <nav className="flex items-center justify-center gap-2 py-10">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-full hover:bg-stone-200 disabled:opacity-30 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                              currentPage === i + 1 
                              ? "bg-stone-900 text-white shadow-md scale-110" 
                              : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-100"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-full hover:bg-stone-200 disabled:opacity-30 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </nav>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm px-6 text-center">
                    <div className="bg-stone-50 p-6 rounded-full mb-6">
                      <SearchX className="w-12 h-12 text-stone-300" />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 tracking-tight">No stories found</h3>
                    <p className="text-stone-500 mt-2 max-w-xs">
                      We couldn't find any posts matching your search.
                    </p>
                    <button 
                      onClick={() => {
                        setFilteredBlogs(blogs);
                        window.location.reload();
                      }}
                      className="mt-8 px-8 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all active:scale-95 shadow-lg shadow-stone-200"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                <h2 className="font-black text-stone-900 uppercase tracking-widest text-xs mb-6 border-b border-stone-50 pb-2">
                  Recommended Topics
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["Technology", "Programming", "Arch Linux", "Productivity", "Writing", "AI"].map(topic => (
                    <button 
                      key={topic} 
                      onClick={() => handleSearch(topic)} 
                      className="px-4 py-2 bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-600 rounded-full text-sm font-bold transition-all active:scale-95 border border-stone-100 hover:border-stone-900"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      
      <footer className="mt-20 border-t border-stone-100 bg-white py-10 text-center text-stone-400 font-medium text-sm">
        <p>&copy; {new Date().getFullYear()} Inscribe. All rights reserved.</p>
        <p className="mt-1">
          Crafted by <a href="https://github.com/shaikhaman01" className="text-stone-600 hover:underline">Aman</a>
        </p>
      </footer>
    </div>
  );
};

export default Blogs;