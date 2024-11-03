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
    
    return(
        <div className="min-h-screen bg-stone-50 ">
            <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
        <Link to={"/"}  className="flex items-center text-4xl font-bold text-stone-800">
        <Feather className="h-6 w-6 mr-2" />
        Inscribe
        </Link>
        <ul className="flex justify-center items-center space-x-6">
            <li><Link to={"/blogs"} className="text-stone-600 hover:text-stone-900">Blogs</Link></li>
            <li><Link to={"/publish"} className="text-stone-600 hover:text-stone-900">Write</Link></li>
            <li> <Link to={"/signup"} className="inline-flex items-center bg-stone-800 text-stone-100 rounded-md px-4 py-2 transition-colors hover:bg-stone-700">
                    Get Started 
                    </Link></li>
        </ul>
        </nav>
            </header>

            <main className="container mx-auto py-16 px-4">
                <section className="mb-36 text-center">
                    <h1 className="mb-4 font-serif font-bold text-5xl text-stone-800">Welcome to Inscribe</h1>
                    <p className="mb-8 text-xl text-stone-600">Where words find their homes and ideas take flight.</p>
                    <Link to={"/signup"} className="inline-flex items-center bg-stone-800 text-stone-100 rounded-md px-6 py-3 transition-colors hover:bg-stone-700">
                    Start Reading 
                    <ArrowRight className="ml-2 h-4 w-4"/>
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
              blogs.slice(0, 3).map((blog:Blog) => (
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


            <footer className="mt-14 border-t border-stone-200 bg-white py-6 text-center text-stone-600">
                <p>&copy; {new Date().getFullYear()} Inscribe. All rights reserved.</p>
                <p>Made with ♡ by   
                    <a href="https://github.com/shaikhaman01"> Aman </a></p>
            </footer>

        </div>
    )
} 
