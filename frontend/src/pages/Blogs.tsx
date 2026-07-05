import BlogCard from "../components/BlogCard";
import Appbar from "../components/Appbar";
import { useBlogs } from "../hooks";
import BlogSkeleton from "../components/BlogSkeleton";
import { useEffect, useMemo, useState } from "react";
import { formattedDate } from "../utils/FormattedDate";
import { useNavigate } from "react-router-dom";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";

const stripHtml = (html: string) => {
  if (typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "");
};

const Blogs = () => {
  const { loading, blogs } = useBlogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
    }
  }, [navigate]);

  const filteredBlogs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(term) ||
        blog.tags?.some((tag) => tag.name.toLowerCase().includes(term)) ||
        stripHtml(blog.content).toLowerCase().includes(term)
    );
  }, [blogs, searchTerm]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col">
      <Appbar searchTerm={searchTerm} onSearch={handleSearch} />

      <main className="flex justify-center py-6 sm:py-10 px-4 flex-grow">
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
                        <div
                          key={blog.id}
                          className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all hover:border-stone-200 hover:shadow-md"
                        >
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
                      <nav
                        aria-label="Pagination"
                        className="flex items-center justify-center gap-2 py-10 flex-wrap"
                      >
                        <button
                          onClick={() => goToPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          aria-label="Previous page"
                          className="p-2 rounded-full hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                        >
                          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            aria-label={`Page ${i + 1}`}
                            aria-current={currentPage === i + 1 ? "page" : undefined}
                            className={`w-10 h-10 rounded-full font-bold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                              currentPage === i + 1
                                ? "bg-stone-900 text-white shadow-md scale-110"
                                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-100"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          aria-label="Next page"
                          className="p-2 rounded-full hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                        >
                          <ChevronRight className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </nav>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm px-6 text-center">
                    <div className="bg-stone-50 p-6 rounded-full mb-6">
                      <SearchX className="w-12 h-12 text-stone-300" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 tracking-tight">
                      No stories found
                    </h3>
                    <p className="text-stone-500 mt-2 max-w-xs">
                      {searchTerm
                        ? `We couldn't find any posts matching "${searchTerm}".`
                        : "There are no stories here yet. Be the first to write one!"}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => handleSearch("")}
                        className="mt-8 px-8 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all active:scale-95 shadow-lg shadow-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                      >
                        Clear search
                      </button>
                    )}
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
                  {["Technology", "Programming", "Arch Linux", "Productivity", "Writing", "AI"].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleSearch(topic)}
                      className="px-4 py-2 bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-600 rounded-full text-sm font-bold transition-all active:scale-95 border border-stone-100 hover:border-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
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
          Crafted by{" "}
          <a
            href="https://github.com/shaikhaman01"
            target="_blank"
            rel="noreferrer"
            className="text-stone-600 hover:underline"
          >
            Aman
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Blogs;
