import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import LikeButton from '../components/LikeButton';
import { formatDate } from '../utils/helpers';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import api from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/posts/${id}`);
      setPost(response.data.post);
      setRelatedPosts(response.data.relatedPosts || []);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Post not found');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading post..." />;
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{error}</p>
          <Button as={Link} to="/" variant="outline-primary">
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Post Not Found</h4>
          <p>The post you're looking for doesn't exist.</p>
          <Button as={Link} to="/" variant="outline-primary">
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <article>
            {/* Post Header */}
            <div className="mb-4">
              <div className="mb-3">
                <Badge bg="primary" className="me-2">{post.category}</Badge>
                <small className="text-muted">{post.readTime} min read</small>
                {isAdmin && (
                  <Button
                    as={Link}
                    to={`/admin/edit-post/${post._id}`}
                    variant="outline-secondary"
                    size="sm"
                    className="ms-2"
                  >
                    Edit Post
                  </Button>
                )}
              </div>
              
              <h1 className="display-5 fw-bold mb-3">{post.title}</h1>
              
              <div className="post-meta">
                <div className="d-flex align-items-center">
                  <div>
                    <strong>By {post.author.username}</strong>
                    <div className="text-muted">
                      Published on {formatDate(post.createdAt)} • {post.views} views
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-4">
                <img
                  src={getImageUrl(post.featuredImage)}
                  alt={post.title}
                  className="featured-image"
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    maxHeight: '400px', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={handleImageError}
                  onLoad={() => {
                    console.log('Featured image loaded successfully for post:', post.title);
                  }}
                />
              </div>
            )}

            {/* Post Content */}
            <div 
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Post Actions */}
            <div className="mt-4 pt-4 border-top">
              <div className="d-flex align-items-center justify-content-between">
                <LikeButton 
                  postId={post._id} 
                  initialLikesCount={post.likesCount || 0}
                  size="md"
                />
                <div className="share-buttons">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }}
                    className="me-2"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3">
                <h6>Tags:</h6>
                {post.tags.map((tag, index) => (
                  <Badge key={index} bg="light" text="dark" className="me-2">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Author Bio */}
            {post.author.bio && (
              <Card className="mt-4">
                <Card.Body>
                  <h5>About the Author</h5>
                  <div className="d-flex align-items-start">
                    <div>
                      <h6>{post.author.username}</h6>
                      <p className="text-muted mb-0">{post.author.bio}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Comments */}
            <CommentSection postId={post._id} comments={post.comments} />
          </article>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <Card className="sidebar-widget">
              <Card.Header>
                <h5 className="mb-0">Related Posts</h5>
              </Card.Header>
              <Card.Body>
                {relatedPosts.map(relatedPost => (
                  <div key={relatedPost._id} className="mb-3 pb-3 border-bottom">
                    {relatedPost.featuredImage && (
                      <img
                        src={getImageUrl(relatedPost.featuredImage)}
                        alt={relatedPost.title}
                        className="img-fluid rounded mb-2"
                        style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                        onError={handleImageError}
                      />
                    )}
                    <h6>
                      <Link 
                        to={`/post/${relatedPost._id}`}
                        className="text-decoration-none"
                      >
                        {relatedPost.title}
                      </Link>
                    </h6>
                    <small className="text-muted">
                      {formatDate(relatedPost.createdAt)}
                    </small>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Share Widget */}
          <Card className="sidebar-widget">
            <Card.Header>
              <h5 className="mb-0">Share This Post</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetail;