import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import Landing from "./pages/Landing";

const Signup = lazy(() => import("./pages/Signup"));
const Signin = lazy(() => import("./pages/Signin"));
const Blog = lazy(() => import("./pages/Blog"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Publish = lazy(() => import("./pages/Publish"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
              <Loader2 className="w-8 h-8 animate-spin text-stone-400" aria-label="Loading page" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/publish" element={<Publish />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
