import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export const useComments = (postId: string) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/comments/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments ', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = async (content: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/comments`,
      { content, postId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.id) {
      await fetchComments();
    }
    return response.data;
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { loading, comments, addComment };
};
