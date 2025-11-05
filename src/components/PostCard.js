import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Eye, ChatDots } from 'react-bootstrap-icons';
import LikeButton from './LikeButton';
import { formatDate } from '../utils/helpers';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const PostCard = ({ post }) => {
  return (
    <Card className="post-card h-100 fade-in-up hover-lift">
      {post.featuredImage && (
        <div className="overflow-hidden" style={{ borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
          <Card.Img 
            variant="top" 
            src={getImageUrl(post.featuredImage)}
            className="featured-image hover-scale"
            alt={post.title}
            style={{ height: '200px', objectFit: 'cover' }}
            onError={handleImageError}
            onLoad={() => {
              console.log('PostCard image loaded successfully:', post.title);
            }}
          />
        </div>
      )}
      <Card.Body className="d-flex flex-column p-xl">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="post-card-category">
            {post.category}
          </span>
          <small className="text-muted font-weight-medium">
            {post.readTime} min read
          </small>
        </div>
        
        <Card.Title className="post-card-title font-heading mb-3">
          {post.title}
        </Card.Title>
        
        <Card.Text className="post-card-text flex-grow-1">
          {post.excerpt}
        </Card.Text>
        
        {post.tags && post.tags.length > 0 && (
          <div className="tag-cloud mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} className="interactive">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          <div className="post-card-meta mb-3">
            <div className="post-card-date">
              <small className="text-muted font-weight-medium">
                By <span className="text-primary">{post.author.username}</span> • {formatDate(post.createdAt)}
              </small>
            </div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3">
              <small className="text-muted d-flex align-items-center interactive">
                <Eye className="me-1" size={14} />
                <span>{post.views || 0}</span>
              </small>
              <small className="text-muted d-flex align-items-center interactive">
                <ChatDots className="me-1" size={14} />
                <span>{post.commentsCount || 0}</span>
              </small>
            </div>
            <LikeButton 
              postId={post._id} 
              initialLikesCount={post.likesCount || 0}
              size="sm"
            />
          </div>
          
          <Button 
            as={Link} 
            to={`/post/${post._id}`} 
            className="btn-gradient w-100 focus-visible"
            size="sm"
          >
            Read More
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;