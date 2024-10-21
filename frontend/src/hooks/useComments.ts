import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

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
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/comments/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setComments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        setLoading(false);
      });
  }, [postId, token]);

  return { loading, comments };
};