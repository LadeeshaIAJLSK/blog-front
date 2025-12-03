import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { HeartFill, Heart } from 'react-bootstrap-icons';
import api from '../services/api';

const CommentLikeButton = ({ commentId, initialLikesCount = 0, initialLiked = false }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    checkLikeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentId]);

  const checkLikeStatus = async () => {
    try {
      const response = await api.get(`/api/comments/${commentId}/like-status`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error checking comment like status:', error);
    }
  };

  const handleLike = async () => {
    const now = Date.now();
    if (loading || (now - lastClickTime < 500)) return; // Prevent rapid clicks
    
    setLastClickTime(now);
    
    // Optimistic update
    const newLiked = !liked;
    const newCount = newLiked ? likesCount + 1 : likesCount - 1;
    
    setLiked(newLiked);
    setLikesCount(Math.max(0, newCount)); // Ensure count doesn't go negative
    setLoading(true);
    
    try {
      const response = await api.post(`/api/comments/${commentId}/like`);
      // Update with actual server response in case our optimistic update was wrong
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      // Revert optimistic update on error  
      setLiked(!newLiked);
      setLikesCount(newLiked ? Math.max(0, likesCount - 1) : likesCount + 1);
      console.error('Error toggling comment like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="link"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className="p-0 text-muted"
      style={{ fontSize: '0.875rem' }}
    >
      {liked ? <HeartFill className="me-1 text-danger" /> : <Heart className="me-1" />}
      {likesCount > 0 && likesCount}
    </Button>
  );
};

export default CommentLikeButton;