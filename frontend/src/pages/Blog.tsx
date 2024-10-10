import React from "react";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import BlogPost from "../components/BlogPost";

const Blog = () => {
  const {id} = useParams();
  const {loading, blog} = useBlog({
    id: id || ""
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  return <div><BlogPost blog={blog}/></div>;
};

export default Blog;
