import { ArrowRight, Feather } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublicBlogs } from "../hooks";
import DOMPurify from "dompurify";
import BlogLandingSkeleton from "../components/BlogLandingSkeleton";

interface Blog {
  id: string;
  title: string;
  content: string;
}

export default function Landing() {
  const { loading, blogs } = usePublicBlogs();
  const stripHtml = (html: string): string => DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });

  

 


  return (
    <div>
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <Link to={"/"} className="flex items-center text-4xl font-bold text-stone-800">
            <Feather className="h-6 w-6 mr-2" />
            Inscribe
          </Link>
          <ul className="hidden md:flex justify-center items-center space-x-6">
            <li><Link to={"/blogs"} className="text-stone-600 hover:text-stone-900 hover:underline">Blogs</Link></li>
            <li><Link to={"/publish"} className="text-stone-600 hover:text-stone-900 hover:underline">Write</Link></li>
            <li> <Link to={"/signup"} className="inline-flex items-center bg-stone-800 text-stone-100 rounded-md px-4 py-2 transition-colors hover:bg-stone-700">
              Get Started
            </Link></li>
          </ul>
        </nav>
      </header>
      <div className="h-[50rem] w-full  bg-white bg-dot-black/[0.2] relative flex items-center justify-center">

      {/* Radial gradient for the container to give a faded look */}
      
      
      <main className="container mx-auto py-16 px-4">
        <section className="mb-36 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mt-8 mb-4">
          Transform Your Ideas Into Powerful Stories
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mx-auto mb-4">
          Your premier platform for crafting, sharing, and discovering exceptional writing. Join our community of passionate writers and readers today.
        </p>
          <Link to={"/signup"} className="inline-flex items-center bg-stone-800 text-stone-100 rounded-md px-6 py-3 transition-colors hover:bg-stone-700">
            Start Reading
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>

        <section>
          <h2 className="font-serif font-bold text-stone-900 mb-8 text-3xl">Featured Posts</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <BlogLandingSkeleton key={index} />
              ))
            ) : (
              blogs.slice(0, 3).map((blog: Blog) => (
                <article key={blog.id} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="mb-2 font-serif text-xl font-semibold text-stone-800">{blog.title}</h3>
                  <p className="mb-4 text-stone-600 line-clamp-2">
                    {stripHtml(blog.content)}
                  </p>
                  <Link to={`/blog/${blog.id}`} className="text-stone-800 hover:underline flex items-center ">
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

    </div>

      

      <footer className="mt-14 border-t border-stone-200 bg-white py-6 text-center text-stone-600">
        <p>&copy; {new Date().getFullYear()} Inscribe. All rights reserved.</p>
        <p>Made with ♡ by
          <a href="https://github.com/shaikhaman01"> Aman </a></p>
      </footer>
    </div>
  )
}
