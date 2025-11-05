import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    metaDescription: '',
    status: 'published'
  });
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Technology', 'Travel', 'Food', 'Lifestyle', 
    'Business', 'Health', 'Education', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = {
      ...formData,
      featuredImage: imageUrl || null
    };

    try {
      const response = await api.post('/api/admin/posts', submitData);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const insertHtml = (tag, placeholder = '') => {
    const textarea = document.querySelector('textarea[name="content"]');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let newText;
    switch(tag) {
      case 'h2':
        newText = `${beforeText}<h2>${selectedText || 'Your Heading Here'}</h2>\n${afterText}`;
        break;
      case 'h3':
        newText = `${beforeText}<h3>${selectedText || 'Your Subheading Here'}</h3>\n${afterText}`;
        break;
      case 'p':
        newText = `${beforeText}<p>${selectedText || 'Your paragraph text here.'}</p>\n${afterText}`;
        break;
      case 'strong':
        newText = `${beforeText}<strong>${selectedText || 'bold text'}</strong>${afterText}`;
        break;
      case 'em':
        newText = `${beforeText}<em>${selectedText || 'italic text'}</em>${afterText}`;
        break;
      case 'ul':
        newText = `${beforeText}<ul>\n  <li>${selectedText || 'First item'}</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ul>\n${afterText}`;
        break;
      case 'ol':
        newText = `${beforeText}<ol>\n  <li>${selectedText || 'First item'}</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ol>\n${afterText}`;
        break;
      case 'blockquote':
        newText = `${beforeText}<blockquote>\n  <p>${selectedText || 'Your quote here'}</p>\n</blockquote>\n${afterText}`;
        break;
      case 'code':
        newText = `${beforeText}<code>${selectedText || 'code snippet'}</code>${afterText}`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          newText = `${beforeText}<a href="${url}">${selectedText || 'Link text'}</a>${afterText}`;
        } else {
          return;
        }
        break;
      default:
        return;
    }
    
    setFormData({...formData, content: newText});
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newText.length - beforeText.length - afterText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 10);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card>
            <Card.Header>
              <h2 className="mb-0">Create New Post</h2>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter post title"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Excerpt *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Brief description of your post (max 300 characters)"
                        maxLength={300}
                        required
                      />
                      <Form.Text className="text-muted">
                        {formData.excerpt.length}/300 characters
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Content *</Form.Label>
                      
                      {/* HTML Formatting Toolbar */}
                      <div className="mb-2 p-2 border rounded bg-light">
                        <small className="text-muted d-block mb-2">Formatting Tools:</small>
                        <div className="d-flex flex-wrap gap-1">
                          <Button variant="outline-primary" size="sm" onClick={() => insertHtml('h2')}>
                            H2
                          </Button>
                          <Button variant="outline-primary" size="sm" onClick={() => insertHtml('h3')}>
                            H3
                          </Button>
                          <Button variant="outline-primary" size="sm" onClick={() => insertHtml('p')}>
                            Paragraph
                          </Button>
                          <Button variant="outline-success" size="sm" onClick={() => insertHtml('strong')}>
                            <strong>Bold</strong>
                          </Button>
                          <Button variant="outline-success" size="sm" onClick={() => insertHtml('em')}>
                            <em>Italic</em>
                          </Button>
                          <Button variant="outline-info" size="sm" onClick={() => insertHtml('ul')}>
                            • List
                          </Button>
                          <Button variant="outline-info" size="sm" onClick={() => insertHtml('ol')}>
                            1. Numbered
                          </Button>
                          <Button variant="outline-secondary" size="sm" onClick={() => insertHtml('blockquote')}>
                            Quote
                          </Button>
                          <Button variant="outline-dark" size="sm" onClick={() => insertHtml('code')}>
                            Code
                          </Button>
                          <Button variant="outline-warning" size="sm" onClick={() => insertHtml('link')}>
                            Link
                          </Button>
                        </div>
                      </div>
                      
                      <Form.Control
                        as="textarea"
                        rows={20}
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your post content here... Use the buttons above to add HTML formatting."
                        required
                        style={{ 
                          fontFamily: 'Consolas, Monaco, "Courier New", monospace', 
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}
                      />
                      <Form.Text className="text-muted">
                        <strong>Quick Tips:</strong> Select text and click formatting buttons, or type HTML directly. 
                        Use &lt;p&gt;...&lt;/p&gt; for paragraphs, &lt;h2&gt;...&lt;/h2&gt; for headings.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Meta Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        placeholder="SEO meta description (max 160 characters)"
                        maxLength={160}
                      />
                      <Form.Text className="text-muted">
                        {formData.metaDescription.length}/160 characters - This appears in Google search results
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tags</Form.Label>
                      <Form.Control
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="react, javascript, tutorial"
                      />
                      <Form.Text className="text-muted">
                        Separate tags with commas
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Featured Image URL</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                      />
                      <Form.Text className="text-muted">
                        Use any image URL from the web
                      </Form.Text>

                      {imagePreview && (
                        <div className="mt-3">
                          <div className="border rounded p-2" style={{ backgroundColor: '#f8f9fa' }}>
                            <small className="text-muted d-block mb-2">Preview:</small>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="img-fluid rounded"
                              style={{ maxHeight: '200px', maxWidth: '100%' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'block';
                              }}
                            />
                            <div 
                              style={{ 
                                display: 'none', 
                                padding: '20px', 
                                textAlign: 'center', 
                                color: '#dc3545',
                                backgroundColor: '#f8f9fa',
                                border: '2px dashed #dc3545',
                                borderRadius: '4px'
                              }}
                            >
                              Failed to load image. Please check the URL.
                            </div>
                          </div>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Post Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="published">Published (visible to visitors)</option>
                        <option value="draft">Draft (save for later)</option>
                      </Form.Select>
                      <Form.Text className="text-muted">
                        {formData.status === 'published' ? 'Will be visible to visitors immediately' : 'Saved as draft for later editing'}
                      </Form.Text>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Creating...
                          </>
                        ) : (
                          formData.status === 'published' ? 'Publish Post' : 'Save as Draft'
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => navigate('/admin/dashboard')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePost;