import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const Signup = lazy(() => import("./pages/Signup"));
const Signin = lazy(() => import("./pages/Signin"));
const Blog = lazy(() => import("./pages/Blog"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Publish = lazy(() => import("./pages/Publish"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense>
          <Routes>
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
