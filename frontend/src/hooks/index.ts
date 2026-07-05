import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Blog {
  content: string;
  title: string;
  id: string;
  createdAt: string;
  author: {
    name: string;
  };
  tags: { name: string }[];
  _count: { likes: number };
  likes?: number;
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBlog(response.data.post);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog:", error);
        setLoading(false);
        navigate("/signup");
      });
  }, [id, navigate]);

  return { loading, blog };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBlogs(response.data.post);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      });
  }, []);

  return { loading, blogs };
};

export const usePublicBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/featured-blog`)
      .then((response) => {
        if (response.data && response.data.post) {
          setBlogs(response.data.post);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, blogs };
};

export const toggleLike = async (id: string) => {
  const token = localStorage.getItem("token");
  await axios.post(`${BACKEND_URL}/api/v1/blog/like/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
