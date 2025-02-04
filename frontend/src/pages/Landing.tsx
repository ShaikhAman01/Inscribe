import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Feather } from "lucide-react";
import { ArrowRight } from "lucide-react";

export default function Landing() {
  const isUnderConstruction = true; // Toggle this flag

  return (
    <div>
      {isUnderConstruction ? (
        <ComingSoon />
      ) : (
        <div>
          {/* Landing Page Content */}
          <header className="container mx-auto px-4 py-8">
            <nav className="flex items-center justify-between">
              <Link to={"/"} className="flex items-center text-4xl font-bold text-stone-800">
                <Feather className="h-6 w-6 mr-2" />
                Inscribe
              </Link>
              <ul className="hidden md:flex justify-center items-center space-x-6">
                <li><Link to={"/blogs"} className="text-stone-600 hover:text-stone-900 hover:underline">Blogs</Link></li>
                <li><Link to={"/publish"} className="text-stone-600 hover:text-stone-900 hover:underline">Write</Link></li>
                <li>
                  <Link to={"/signup"} className="inline-flex items-center bg-stone-800 text-stone-100 rounded-md px-4 py-2 transition-colors hover:bg-stone-700">
                    Get Started
                  </Link>
                </li>
              </ul>
            </nav>
          </header>

          {/* Landing Page Main Content */}
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
              {/* Render Featured Posts */}
            </section>
          </main>

          {/* Footer */}
          <footer className="mt-14 border-t border-stone-200 bg-white py-6 text-center text-stone-600">
            <p>&copy; {new Date().getFullYear()} Inscribe. All rights reserved.</p>
            <p>Made with ♡ by <a href="https://github.com/shaikhaman01">Aman</a></p>
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
          .delay-150 { animation-delay: 0.15s; }
          .delay-300 { animation-delay: 0.3s; }
          
          @keyframes progress {
            0% { width: 0%; }
            50% { width: 50%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 3s infinite alternate;
          }

          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}