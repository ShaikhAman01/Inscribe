import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog {
  content: string;
  title: string;
  id: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export const useBlog= ({id}:{id:string})=>{
    const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();
  const token = localStorage.getItem("token");
  console.log("token:", token);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setBlog(response.data.post);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, [id]);

  console.log(blog);

  return { loading, blog };
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const token = localStorage.getItem("token");
  console.log("token:", token);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setBlogs(response.data.post);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  console.log(blogs);

  return { loading, blogs };
};
