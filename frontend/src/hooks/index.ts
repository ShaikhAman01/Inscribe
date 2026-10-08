import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getToken = () => localStorage.getItem("token");
export const isSignedIn = () => Boolean(getToken());

export const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
};

export interface BlogSummary {
  id: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  createdAt: string;
  author: { name: string };
  tags: { name: string }[];
  likeCount: number;
  likedByMe: boolean;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: { name: string };
  tags: { name: string }[];
  readMinutes: number;
  likeCount: number;
  likedByMe: boolean;
  isMine: boolean;
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, { headers: authHeaders() })
      .then((response) => setBlog(response.data.post))
      .catch((error) => {
        console.error("Error fetching blog:", error);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { loading, blog, notFound };
};

export const useBlogs = (query: string) => {
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const requestId = useRef(0);

  const fetchPage = useCallback(
    async (cursor: string | null) => {
      const id = ++requestId.current;
      const params: Record<string, string> = {};
      if (query) params.q = query;
      if (cursor) params.cursor = cursor;
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, { params, headers: authHeaders() });
      // A newer search may have started while this one was in flight.
      if (id !== requestId.current) return null;
      return response.data as { posts: BlogSummary[]; nextCursor: string | null };
    },
    [query]
  );

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchPage(null)
      .then((data) => {
        if (!data) return;
        setBlogs(data.posts);
        setNextCursor(data.nextCursor);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError(true);
        setLoading(false);
      });
  }, [fetchPage]);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchPage(nextCursor);
      if (data) {
        setBlogs((prev) => [...prev, ...data.posts]);
        setNextCursor(data.nextCursor);
      }
    } catch (err) {
      console.error("Error loading more blogs:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return { loading, loadingMore, error, blogs, hasMore: Boolean(nextCursor), loadMore };
};

export interface FeaturedBlog {
  id: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  createdAt: string;
  author: { name: string };
}

export const usePublicBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<FeaturedBlog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/featured-blog`)
      .then((response) => setBlogs(response.data.posts ?? []))
      .catch((error) => console.error("Error fetching blogs:", error))
      .finally(() => setLoading(false));
  }, []);

  return { loading, blogs };
};

export const toggleLike = async (id: string) => {
  const response = await axios.post(`${BACKEND_URL}/api/v1/blog/like/${id}`, {}, { headers: authHeaders() });
  return response.data as { liked: boolean; likeCount: number };
};

export const deletePost = (id: string) =>
  axios.delete(`${BACKEND_URL}/api/v1/blog/${id}`, { headers: authHeaders() });

export const deleteAccount = (password: string) =>
  axios.delete(`${BACKEND_URL}/api/v1/user/me`, { headers: authHeaders(), data: { password } });
