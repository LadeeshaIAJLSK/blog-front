import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import CommentLikeButton from './CommentLikeButton';
import api from '../services/api';
import { formatDate } from '../utils/helpers';

const CommentSection = ({ postId, comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState({
    text: '',
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch comments when component mounts or postId changes
  React.useEffect(() => {
    if (postId) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await api.get(`/api/posts/${postId}/comments`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // If API call fails, use initial comments
      setComments(initialComments || []);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/api/posts/${postId}/comments`, newComment);
      // Refresh comments after adding new comment
      await fetchComments();
      setNewComment({ text: '', username: '', email: '' });
      setSuccess('Comment added successfully!');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h4>Comments ({comments.length})</h4>
      
      {/* Add Comment Form */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Leave a Comment</h5>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newComment.text}
                onChange={(e) => setNewComment({...newComment, text: e.target.value})}
                placeholder="Write your comment..."
                required
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newComment.username}
                    onChange={(e) => setNewComment({...newComment, username: e.target.value})}
                    placeholder="Your name"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newComment.email}
                    onChange={(e) => setNewComment({...newComment, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </Form.Group>
              </div>
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Comments List */}
      {loadingComments ? (
        <div className="text-center py-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading comments...</span>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment, index) => (
          <Card key={comment._id || index} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{comment.username}</h6>
                  <small className="text-muted">{formatDate(comment.createdAt)}</small>
                </div>
              </div>
              <p className="mt-2 mb-2">{comment.text}</p>
              <div className="d-flex align-items-center justify-content-between">
                <CommentLikeButton 
                  commentId={comment._id}
                  initialLikesCount={comment.likesCount || 0}
                />
                <small className="text-muted">
                  {comment.replies && comment.replies.length > 0 && 
                    `${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                  }
                </small>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default CommentSection;