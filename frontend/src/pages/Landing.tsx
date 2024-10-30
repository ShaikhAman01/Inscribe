import { ArrowRight, Feather } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing () {
    return(
        <div className="min-h-screen bg-stone-50 ">
            <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
        <Link to={"/"}  className="flex items-center text-4xl font-bold text-stone-800">
        <Feather className="h-6 w-6 mr-2" />
        Inscribe
        </Link>
        <ul className="flex space-x-6">
            <li><Link to={"/blogs"} className="text-stone-600 hover:text-stone-900">Blog</Link></li>
            <li><Link to={"/"} className="text-stone-600 hover:text-stone-900">About</Link></li>
            <li><Link to={"/"} className="text-stone-600 hover:text-stone-900">Contact</Link></li>
        </ul>
        </nav>
            </header>

            <main className="container mx-auto py-16 px-4">
                <section className="mb-24 text-center">
                    <h1 className="mb-4 font-serif font-bold text-5xl text-stone-800">Welcome to Inscribe</h1>
                    <p className="mb-8 text-xl text-stone-600">Where words find their homes and ideas take flight.</p>
                    <Link to={"/signup"} className="inline-flex items-center bg-stone-800 text-stone-100 rounded-md px-6 py-3 transition-colors hover:bg-stone-700">
                    Start Reading 
                    <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                </section>

                <section>
                    <h2 className="font-serif font-bold text-stone-900 mb-8 text-3xl  ">Featured Posts</h2>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((post) => (
              <article key={post} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="mb-2 font-serif text-xl font-semibold text-stone-800">The Art of Writing: Part {post}</h3>
                <p className="mb-4 text-stone-600">
                  Explore the nuances of crafting compelling narratives and the power of well-chosen words.
                </p>
                <Link to={`/blog/post-${post}`} className="text-stone-800 hover:underline flex items-center">
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
              </article>
            ))}
                    </div>
                </section>
            </main>


            <footer className="mt-64 border-t border-stone-200 bg-white py-6 text-center text-stone-600">
                <p>&copy; {new Date().getFullYear()} Inscribe. All rights reserved.</p>

            </footer>

        </div>
    )
} 
