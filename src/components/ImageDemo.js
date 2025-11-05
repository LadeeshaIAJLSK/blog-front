import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { getImageUrl } from '../utils/imageUtils';

const ImageDemo = () => {
  const [selectedUrl, setSelectedUrl] = useState('');
  const [step, setStep] = useState(1);

  const demoImages = [
    {
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=entropy&auto=format',
      title: 'Code Editor',
      category: 'Technology'
    },
    {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=entropy&auto=format',
      title: 'JavaScript Code',
      category: 'Programming'
    },
    {
      url: 'https://images.unsplash.com/photo-1545670723-196ed0954986?w=800&h=400&fit=crop&crop=entropy&auto=format',
      title: 'Design Tools',
      category: 'Design'
    }
  ];

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">📷 How to Add Images - Interactive Demo</h3>
            </Card.Header>
            <Card.Body>
              
              {/* Step 1: Choose Image */}
              <div className="mb-4">
                <h5>Step 1: Choose an Image</h5>
                <Alert variant="info">
                  Click any image below to select it (these are from Unsplash - completely free to use!)
                </Alert>
                
                <Row className="g-3">
                  {demoImages.map((image, index) => (
                    <Col md={4} key={index}>
                      <Card 
                        className={`cursor-pointer ${selectedUrl === image.url ? 'border-primary' : ''}`}
                        onClick={() => {
                          setSelectedUrl(image.url);
                          setStep(2);
                        }}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          transform: selectedUrl === image.url ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        <Card.Img 
                          variant="top" 
                          src={image.url} 
                          style={{ height: '150px', objectFit: 'cover' }}
                          alt={image.title}
                        />
                        <Card.Body className="p-2">
                          <small className="fw-bold">{image.title}</small>
                          <br />
                          <small className="text-muted">{image.category}</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Step 2: Copy URL */}
              {step >= 2 && (
                <div className="mb-4 fade-in">
                  <h5>Step 2: Copy the Image URL</h5>
                  <Alert variant="success">
                    ✅ Great choice! Here's the URL for your selected image:
                  </Alert>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL:</Form.Label>
                    <div className="d-flex">
                      <Form.Control 
                        type="text" 
                        value={selectedUrl} 
                        readOnly
                        style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                      />
                      <Button 
                        variant="outline-primary" 
                        className="ms-2"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedUrl);
                          alert('URL copied to clipboard!');
                          setStep(3);
                        }}
                      >
                        📋 Copy
                      </Button>
                    </div>
                  </Form.Group>
                </div>
              )}

              {/* Step 3: Use in Blog */}
              {step >= 3 && (
                <div className="mb-4 fade-in">
                  <h5>Step 3: Use in Your Blog Post</h5>
                  <Alert variant="primary">
                    🎯 Now go to <strong>Create Post</strong> and paste this URL in the "Featured Image" field!
                  </Alert>
                  
                  <div className="d-flex gap-2 justify-content-center">
                    <Button 
                      variant="primary" 
                      href="/admin/create-post" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🚀 Create New Post
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => {
                        setStep(1);
                        setSelectedUrl('');
                      }}
                    >
                      🔄 Try Another Image
                    </Button>
                  </div>
                </div>
              )}

              {/* Preview */}
              {selectedUrl && (
                <div className="mt-4">
                  <h5>Preview: How it will look in your blog</h5>
                  <Card className="post-card hover-lift" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <Card.Img 
                      variant="top" 
                      src={selectedUrl} 
                      style={{ height: '200px', objectFit: 'cover' }}
                      alt="Blog post preview"
                    />
                    <Card.Body>
                      <Card.Title>Your Blog Post Title</Card.Title>
                      <Card.Text>
                        This is how your blog post will look with the selected featured image...
                      </Card.Text>
                      <Button variant="primary" size="sm">Read More</Button>
                    </Card.Body>
                  </Card>
                </div>
              )}

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ImageDemo;