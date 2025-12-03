import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { HeartFill, Heart } from 'react-bootstrap-icons';
import api from '../services/api';

const LikeButton = ({ postId, initialLikesCount = 0, initialLiked = false, size = 'sm' }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    checkLikeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const checkLikeStatus = async () => {
    try {
      const response = await api.get(`/api/posts/${postId}/like-status`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error checking like status:', error);
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
      const response = await api.post(`/api/posts/${postId}/like`);
      // Update with actual server response in case our optimistic update was wrong
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!newLiked);
      setLikesCount(newLiked ? Math.max(0, likesCount - 1) : likesCount + 1);
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={liked ? 'danger' : 'outline-danger'}
      size={size}
      onClick={handleLike}
      disabled={loading}
      className="d-flex align-items-center"
    >
      {liked ? <HeartFill className="me-1" /> : <Heart className="me-1" />}
      {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
    </Button>
  );
};

export default LikeButton;