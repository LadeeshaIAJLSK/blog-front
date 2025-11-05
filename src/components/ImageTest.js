import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import api from '../services/api';

const ImageTest = () => {
  const [posts, setPosts] = useState([]);
  const [testUrl, setTestUrl] = useState('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <Container className="py-5">
      <h2>Image Display Test</h2>
      
      <Alert variant="info">
        <strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:5000'}
      </Alert>

      <Card className="mb-4">
        <Card.Header>Direct Image Test</Card.Header>
        <Card.Body>
          <p><strong>Test URL:</strong> {testUrl}</p>
          <img 
            src={testUrl} 
            alt="Direct test" 
            style={{ maxWidth: '300px', height: 'auto' }}
            onError={(e) => {
              console.error('Direct image failed to load:', e.target.src);
              e.target.style.border = '2px solid red';
            }}
            onLoad={() => console.log('Direct image loaded successfully')}
          />
        </Card.Body>
      </Card>

      {posts.map(post => (
        <Card key={post._id} className="mb-3">
          <Card.Header>
            <strong>Post:</strong> {post.title}
          </Card.Header>
          <Card.Body>
            <p><strong>Featured Image Path:</strong> {post.featuredImage || 'No image'}</p>
            <p><strong>getImageUrl() Result:</strong> {getImageUrl(post.featuredImage) || 'No URL'}</p>
            
            {post.featuredImage && (
              <div>
                <p><strong>Image Test:</strong></p>
                <img
                  src={getImageUrl(post.featuredImage)}
                  alt="Post image test"
                  style={{ maxWidth: '300px', height: 'auto', border: '1px solid #ccc' }}
                  onError={(e) => {
                    console.error('Post image failed to load:', e.target.src);
                    handleImageError(e);
                  }}
                  onLoad={() => console.log('Post image loaded successfully:', post.title)}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default ImageTest;