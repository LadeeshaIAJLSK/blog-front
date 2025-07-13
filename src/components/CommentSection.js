import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post(`/api/posts/${postId}/comments`, newComment);
      setComments([...comments, response.data.comment]);
      setNewComment({ text: '', username: '', email: '' });
      setSuccess('Comment added successfully!');
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
      {comments.length === 0 ? (
        <p className="text-muted">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{comment.username}</h6>
                  <small className="text-muted">{formatDate(comment.createdAt)}</small>
                </div>
              </div>
              <p className="mt-2 mb-0">{comment.text}</p>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default CommentSection;