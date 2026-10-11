import { Link } from "react-router-dom";
import { Feather, ArrowLeft } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page not found");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-6 text-center">
      <Link to="/" className="flex items-center text-2xl font-black tracking-tight text-stone-800 mb-12">
        <Feather className="h-6 w-6 mr-2" aria-hidden="true" />
        Inscribe
      </Link>
      <p className="text-sm font-bold uppercase tracking-widest text-stone-500">404</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
        This page was never written
      </h1>
      <p className="mt-3 max-w-md text-stone-600 leading-relaxed">
        The link may be broken, or the page may have moved. The stories are all still here.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link
          to="/blogs"
          className="px-8 py-3 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
        >
          Browse stories
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-stone-700 border border-stone-200 bg-white hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
