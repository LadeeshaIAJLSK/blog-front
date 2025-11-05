import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';

const APITest = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Testing fetch with simple fetch API...');
      
      // Test with simple fetch first
      const response = await fetch('http://localhost:5000/api/posts');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Data received:', data);
      
      setPosts(data.posts || []);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testFetch();
  }, []);

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h3>API Connection Test</h3>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger">
              <strong>Error:</strong> {error}
            </Alert>
          )}
          
          {loading && <p>Loading...</p>}
          
          <Button onClick={testFetch} disabled={loading}>
            Test API Connection
          </Button>
          
          <div className="mt-3">
            <strong>Posts found:</strong> {posts.length}
            {posts.map(post => (
              <div key={post._id} className="border p-2 mt-2">
                <strong>{post.title}</strong>
                <br />
                Image: {post.featuredImage || 'No image'}
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default APITest;