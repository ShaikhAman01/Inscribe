import React from "react";
import { useBlog } from "../hooks";

const Blog = () => {
  const {loading, blog} = useBlog();
  if (loading) {
    return <div>Loading...</div>;
  }
  return <div></div>;
};

export default Blog;
