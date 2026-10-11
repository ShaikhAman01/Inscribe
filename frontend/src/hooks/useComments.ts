import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { authHeaders } from '.';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
  isMine: boolean;
  canDelete: boolean;
}

export const useComments = (postId: string) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/comments/posts/${postId}`, {
        headers: authHeaders(),
      });
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments ', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = async (content: string) => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/comments`,
      { content, postId },
      { headers: authHeaders() }
    );
    setComments((prev) => [response.data, ...prev]);
    return response.data;
  };

  const deleteComment = async (id: string) => {
    await axios.delete(`${BACKEND_URL}/api/v1/comments/${id}`, { headers: authHeaders() });
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { loading, comments, addComment, deleteComment };
};
