import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Feather, ArrowRight, BookOpen, Heart } from "lucide-react";
import { usePublicBlogs } from "../hooks";

export default function Landing() {
  const isUnderConstruction = false;
  const { loading, blogs } = usePublicBlogs();

  // Helper to strip HTML tags for the preview snippet
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="min-h-screen bg-white">
      {isUnderConstruction ? (
        <ComingSoon />
      ) : (
        <div>
          {/* Header */}
          <header className="container mx-auto px-4 py-8">
            <nav className="flex items-center justify-between">
              <Link
                to={"/"}
                className="flex items-center text-3xl font-black text-stone-800 tracking-tighter"
              >
                <Feather className="h-8 w-8 mr-2 text-stone-900" />
                Inscribe
              </Link>

              <ul className="hidden md:flex justify-center items-center space-x-8">
                <li>
                  <Link
                    to={"/blogs"}
                    className="font-medium text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    Explore
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/publish"}
                    className="font-medium text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    Write
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/signin"}
                    className="font-medium text-stone-900 hover:underline"
                  >
                    Sign In
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/signup"}
                    className="bg-stone-900 text-white rounded-full px-6 py-2.5 font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
                  >
                    Get Started
                  </Link>
                </li>
              </ul>
            </nav>
          </header>

          <main className="container mx-auto px-4">
            {/* Hero Section */}
            <section className="py-20 lg:py-32 text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-8 leading-[1.1] tracking-tight">
                Transform Your Ideas Into{" "}
                <span className="text-stone-400">
                  Powerful Stories.
                </span>
              </h1>

              <p className="text-xl text-stone-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                Join a new generation of writers. A minimalist space designed
                for deep thinking, elegant formatting, and global reach.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={"/signup"}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-stone-900 text-white rounded-full px-8 py-4 text-lg font-bold transition-all hover:bg-stone-800 hover:scale-105 shadow-xl shadow-stone-200"
                >
                  Start Writing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <Link
                  to={"/blogs"}
                  className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-stone-100 bg-white text-stone-900 rounded-full px-8 py-4 text-lg font-bold transition-all hover:bg-stone-50"
                >
                  Browse Stories
                </Link>
              </div>
            </section>

            {/* Featured Posts Section */}
            <section className="py-20 border-t border-stone-100">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black text-stone-900 tracking-tight flex items-center">
                  <BookOpen className="mr-3 h-6 w-6 text-stone-400" />
                  Featured Stories
                </h2>

                <Link
                  to="/blogs"
                  className="text-stone-500 font-bold hover:text-stone-900 flex items-center group"
                >
                  View all{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-stone-50 h-64 rounded-3xl"
                    />
                  ))
                ) : (
                  blogs.map((blog) => (
                    <Link
                      to={`/blog/${blog.id}`}
                      key={blog.id}
                      className="group flex flex-col p-8 rounded-3xl border border-stone-100 bg-white hover:border-stone-200 hover:shadow-2xl hover:shadow-stone-100 transition-all duration-300"
                    >
                      <h3 className="text-2xl font-bold text-stone-900 mb-4 leading-tight group-hover:text-stone-600 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-stone-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {stripHtml(blog.content)}
                      </p>

                      <div className="flex items-center text-stone-900 font-bold text-sm">
                        Read Story{" "}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="mt-28 border-t border-stone-200/60 bg-stone-50/50 pt-16 pb-12 text-stone-600">
            <div className="container mx-auto px-4">
              
              {/* Main Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
                
                {/* Brand Column */}
                <div className="md:col-span-5 flex flex-col items-start space-y-4">
                  <div className="flex items-center text-2xl font-black text-stone-900 tracking-tight">
                    <Feather className="h-6 w-6 mr-2.5 text-stone-900" />
                    Inscribe
                  </div>

                  <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
                    The modern standard for online publishing. Empowering
                    developers, writers, and creators to share insights globally.
                  </p>
                </div>

                {/* Spacer */}
                <div className="hidden md:block md:col-span-1"></div>

                {/* Product Links */}
                <div className="md:col-span-3">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                    Product
                  </h3>

                  <ul className="space-y-2.5 text-sm font-medium">
                    <li>
                      <a
                        href="#"
                        className="hover:text-stone-900 transition-colors"
                      >
                        Features
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="hover:text-stone-900 transition-colors"
                      >
                        AI Insights
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="hover:text-stone-900 transition-colors"
                      >
                        Analytics
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Community Links */}
                <div className="md:col-span-3">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
                    Community
                  </h3>

                  <ul className="space-y-2.5 text-sm font-medium">
                    <li>
                      <a
                        href="#"
                        className="hover:text-stone-900 transition-colors"
                      >
                        Write
                      </a>
                    </li>

                    <li>
                      <a
                        href="#"
                        className="hover:text-stone-900 transition-colors"
                      >
                        Explore
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://github.com/ShaikhAman01/Inscribe"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-stone-900 transition-colors"
                      >
                        OSS Contribute
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Strip */}
              <div className="border-t border-stone-200/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-medium text-stone-400">
                  &copy; {new Date().getFullYear()} Inscribe. All rights reserved.
                </div>

                <div className="text-xs font-semibold text-stone-400 flex items-center gap-1 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/40">
                  Made with{" "}
                  <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />{" "}
                  by{" "}
                  <a
                    href="https://x.com/shaikhaman01"
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-600 hover:text-indigo-600 transition-colors underline decoration-stone-300 hover:decoration-indigo-500"
                  >
                    Aman
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export function ComingSoon() {
  const messages = [
    "Building something amazing...",
    "Optimizing user experience...",
    "Enhancing performance...",
    "Launching soon! 🚀",
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
      setCurrentMessage(messages[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white text-center px-6">
      <div>
        <h1 className="text-4xl font-bold mb-4 animate-fade-in">
          🚀 Big Changes Are Coming!
        </h1>

        <p className="text-lg text-gray-300 mb-6 animate-fade-in">
          {currentMessage}
        </p>

        {/* Loading Dots Animation */}
        <div className="flex justify-center mb-6 space-x-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-150"></span>
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }

          .animate-bounce {
            animation: bounce 1s infinite;
          }

          .delay-150 {
            animation-delay: 0.15s;
          }

          .delay-300 {
            animation-delay: 0.3s;
          }

          @keyframes progress {
            0% { width: 0%; }
            50% { width: 50%; }
            100% { width: 100%; }
          }

          .animate-progress {
            animation: progress 3s infinite alternate;
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 1s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}