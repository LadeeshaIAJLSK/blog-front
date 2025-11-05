import React, { useState } from 'react';
import { Card, Button, Alert, Badge } from 'react-bootstrap';

const ImageSuggestions = ({ onSelectUrl }) => {
  const [selectedCategory, setSelectedCategory] = useState('technology');

  const imageSuggestions = {
    technology: [
      {
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'Code on Screen',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'JavaScript Code',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'Computer Setup',
        source: 'Unsplash'
      }
    ],
    design: [
      {
        url: 'https://images.unsplash.com/photo-1545670723-196ed0954986?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'Design Tools',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'Color Palette',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1586953555565-ad4dc5c8a237?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'UI Design',
        source: 'Unsplash'
      }
    ],
    business: [
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'Business Meeting',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'Team Collaboration',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=entropy&auto=format',
        title: 'Analytics Dashboard',
        source: 'Unsplash'
      }
    ]
  };

  const categories = [
    { key: 'technology', label: 'Technology', icon: '💻' },
    { key: 'design', label: 'Design', icon: '🎨' },
    { key: 'business', label: 'Business', icon: '📊' }
  ];

  return (
    <Card className="mt-3">
      <Card.Header>
        <h6 className="mb-0">🖼️ Quick Image Suggestions</h6>
      </Card.Header>
      <Card.Body>
        <Alert variant="info" className="mb-3">
          <small>
            💡 <strong>Tip:</strong> These are free stock images from Unsplash. 
            Click any image to use it, or find more at{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
              unsplash.com
            </a>
          </small>
        </Alert>

        {/* Category Tabs */}
        <div className="mb-3">
          {categories.map(category => (
            <Badge
              key={category.key}
              bg={selectedCategory === category.key ? 'primary' : 'light'}
              text={selectedCategory === category.key ? 'white' : 'dark'}
              className="me-2 mb-2 interactive"
              style={{ 
                cursor: 'pointer', 
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem'
              }}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.icon} {category.label}
            </Badge>
          ))}
        </div>

        {/* Image Grid */}
        <div className="row g-2">
          {imageSuggestions[selectedCategory].map((image, index) => (
            <div key={index} className="col-md-4">
              <div 
                className="position-relative overflow-hidden rounded"
                style={{ 
                  height: '120px',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--bs-primary)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
                onClick={() => onSelectUrl(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
                <div 
                  className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2"
                  style={{ fontSize: '0.75rem' }}
                >
                  <div className="fw-bold">{image.title}</div>
                  <div className="opacity-75">{image.source}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <small className="text-muted">
            Click any image above to use it, or paste your own image URL in the field above.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ImageSuggestions;