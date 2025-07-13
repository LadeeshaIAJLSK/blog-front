import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    metaDescription: '',
    published: false
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const categories = [
    'Technology', 'Travel', 'Food', 'Lifestyle', 
    'Business', 'Health', 'Education', 'Other'
  ];

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/api/posts/${id}`);
      const post = response.data.post;
      
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags.join(', '),
        metaDescription: post.metaDescription || '',
        published: post.published
      });
      
      if (post.featuredImage) {
        setCurrentImage(post.featuredImage);
      }
    } catch (error) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (featuredImage) {
      submitData.append('featuredImage', featuredImage);
    }

    try {
      await api.put(`/api/posts/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.delete(`/api/posts/${id}`);
        navigate('/admin/dashboard');
      } catch (error) {
        setError('Failed to delete post');
      }
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

  if (fetchLoading) {
    return <LoadingSpinner message="Loading post..." />;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Edit Post</h2>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}
              >
                Delete Post
              </Button>
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
                        placeholder="Write your post content here..."
                        required
                        style={{ 
                          fontFamily: 'Consolas, Monaco, "Courier New", monospace', 
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}
                      />
                      <Form.Text className="text-muted">
                        <strong>Quick Tips:</strong> Select text and click formatting buttons, or type HTML directly.
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
                        {formData.metaDescription.length}/160 characters
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
                        placeholder="Enter tags separated by commas"
                      />
                      <Form.Text className="text-muted">
                        Separate tags with commas (e.g. react, javascript, web)
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Featured Image</Form.Label>
                      {currentImage && !imagePreview && (
                        <div className="mb-2">
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${currentImage}`}
                            alt="Current featured"
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px' }}
                          />
                          <div className="text-muted mt-1 small">Current image</div>
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px' }}
                          />
                          <div className="text-muted mt-1 small">New image preview</div>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleChange}
                        label="Published"
                      />
                      <Form.Text className="text-muted">
                        {formData.published ? 'Visible to visitors' : 'Saved as draft'}
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
                            Updating...
                          </>
                        ) : (
                          'Update Post'
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

export default EditPost;