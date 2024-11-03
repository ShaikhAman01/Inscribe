import { useState, useEffect } from 'react';
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
  const token = localStorage.getItem('token');

  const fetchComments = async ()=>{
   await axios.get(`${BACKEND_URL}/api/v1/comments/posts/${postId}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    .then((response)=>{
      setComments(response.data.comments);
      setLoading(false)
    })
    .catch((error)=>{
      console.error("Error fetching comments ", error);
      setLoading(false)
    })
  }


  const addComment = async(content:string)=>{
    try {
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

      if(response.data.id){

        await fetchComments(); 
      }
      return response.data;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return { loading, comments, addComment };
};