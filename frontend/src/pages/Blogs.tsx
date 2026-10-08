import BlogCard from "../components/BlogCard";
import Appbar from "../components/Appbar";
import { useBlogs } from "../hooks";
import BlogSkeleton from "../components/BlogSkeleton";
import { useEffect, useState } from "react";
import { formattedDate } from "../utils/FormattedDate";
import { SearchX, Loader2 } from "lucide-react";

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const { loading, loadingMore, error, blogs, hasMore, loadMore } = useBlogs(query);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchTerm.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (term: string) => setSearchTerm(term);

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
                {blogs.length > 0 ? (
                  <>
                    <div className="space-y-6">
                      {blogs.map((blog) => (
                        <div
                          key={blog.id}
                          className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden transition-all hover:border-stone-200 hover:shadow-md"
                        >
                          <BlogCard
                            id={blog.id}
                            authorName={blog.author?.name || "Anonymous"}
                            title={blog.title}
                            excerpt={blog.excerpt}
                            readMinutes={blog.readMinutes}
                            createdAt={formattedDate(blog.createdAt)}
                            tags={blog.tags}
                          />
                        </div>
                      ))}
                    </div>

                    {hasMore && (
                      <div className="flex justify-center py-10">
                        <button
                          onClick={loadMore}
                          disabled={loadingMore}
                          className="flex items-center gap-2 px-8 py-3 bg-white text-stone-900 rounded-full font-bold border border-stone-200 hover:bg-stone-100 transition-all active:scale-95 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                        >
                          {loadingMore && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                          {loadingMore ? "Loading..." : "Load more stories"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm px-6 text-center">
                    <div className="bg-stone-50 p-6 rounded-full mb-6">
                      <SearchX className="w-12 h-12 text-stone-300" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-black text-stone-900 tracking-tight">
                      {error ? "Couldn't load stories" : "No stories found"}
                    </h3>
                    <p className="text-stone-500 mt-2 max-w-xs">
                      {error
                        ? "Something went wrong on our side. Please refresh to try again."
                        : query
                        ? `We couldn't find any posts matching "${query}".`
                        : "There are no stories here yet. Be the first to write one!"}
                    </p>
                    {query && !error && (
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
