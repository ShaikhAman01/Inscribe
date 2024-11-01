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
    <div>
      <Appbar onSearch={handleSearch} />
      <div className="flex justify-center py-3 bg-white">
        <div>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))
          ) : filteredBlogs.length ? (
            currentBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                authorName={blog.author?.name || "Anonymous"}
                title={blog.title}
                content={stripHtml(blog.content)}
                createdAt={formattedDate(blog.createdAt)}
              />
            ))
          ) : (
            <div>No Blogs Available</div>
          )}

          {/* //Pagination */}
          <nav className="flex items-center gap-x-1 justify-center py-5">
            <button
              type="button"
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 mx-1 ${
                  currentPage === index + 1
                    ? "bg-slate-950  text-white"
                    : "bg-gray-200"
                } rounded hover:bg-gray-300`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              type="button"
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </nav>
        </div>
      </div>
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-stone-600">
                <p>&copy; {new Date().getFullYear()} Inscribe. All rights reserved.</p>
                <p>Made with ♡ by   
                    <a href="https://github.com/shaikhaman01"> Aman </a></p>
            </footer>
    </div>
  );
};

export default Blogs;
