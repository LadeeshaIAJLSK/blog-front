import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

const PostCard = ({ post }) => {
  return (
    <Card className="h-100 shadow-sm">
      {post.featuredImage && (
        <Card.Img 
          variant="top" 
          src={`${process.env.REACT_APP_API_URL}/${post.featuredImage}`}
          style={{ height: '200px', objectFit: 'cover' }}
          alt={post.title}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="primary" className="me-2">{post.category}</Badge>
          <small className="text-muted">{post.readTime} min read</small>
        </div>
        
        <Card.Title className="h5">{post.title}</Card.Title>
        <Card.Text className="flex-grow-1 text-muted">
          {post.excerpt}
        </Card.Text>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} bg="light" text="dark" className="me-1">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">
              By {post.author.username} • {formatDate(post.createdAt)}
            </small>
            <small className="text-muted">
              {post.views} views
            </small>
          </div>
          
          <Button 
            as={Link} 
            to={`/post/${post._id}`} 
            variant="primary" 
            size="sm"
            className="w-100"
          >
            Read More
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;