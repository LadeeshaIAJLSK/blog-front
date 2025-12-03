import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateTime } from '../utils/helpers';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const response = await api.get('/api/admin/posts', { params });
      setPosts(response.data.posts);
      setError('');
    } catch (error) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async (postId) => {
    try {
      await api.patch(`/api/admin/posts/${postId}/publish`);
      fetchPosts(); // Refresh the posts list
      fetchDashboardData(); // Refresh stats
    } catch (error) {
      setError('Failed to update post status');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <Button as={Link} to="/admin/create-post" variant="primary">
          Create New Post
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="admin-stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Total Posts</h6>
                  <h2 className="mb-0">{stats.totalPosts || 0}</h2>
                </div>
                <div className="text-primary">
                  <i className="fas fa-file-alt fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="admin-stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Published</h6>
                  <h2 className="mb-0">{stats.publishedPosts || 0}</h2>
                </div>
                <div className="text-success">
                  <i className="fas fa-check-circle fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="admin-stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Drafts</h6>
                  <h2 className="mb-0">{stats.draftPosts || 0}</h2>
                </div>
                <div className="text-warning">
                  <i className="fas fa-edit fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="admin-stats-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Total Views</h6>
                  <h2 className="mb-0">{stats.totalViews || 0}</h2>
                </div>
                <div className="text-info">
                  <i className="fas fa-eye fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Posts Management */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Manage Posts</h5>
            
            {/* Filters */}
            <Row className="g-2">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Search posts..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  size="sm"
                />
              </Col>
              <Col>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  size="sm"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  size="sm"
                >
                  <option value="">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Col>
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {posts.length === 0 ? (
            <div className="text-center py-5">
              <h5>No posts found</h5>
              <p className="text-muted">
                {Object.values(filters).some(f => f) ? 
                  'Try adjusting your filters.' : 
                  'Create your first post to get started!'
                }
              </p>
              <Button as={Link} to="/admin/create-post" variant="primary">
                Create New Post
              </Button>
            </div>
          ) : (
            <Table responsive className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id}>
                    <td>
                      <div>
                        <strong>{post.title}</strong>
                        {post.featuredImage && (
                          <Badge bg="info" className="ms-2">
                            Has Image
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg="secondary">{post.category}</Badge>
                    </td>
                    <td>
                      <Badge bg={post.published ? 'success' : 'warning'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td>{post.views}</td>
                    <td>{formatDateTime(post.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          as={Link}
                          to={`/admin/edit-post/${post._id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant={post.published ? 'outline-warning' : 'outline-success'}
                          size="sm"
                          onClick={() => togglePublishStatus(post._id)}
                        >
                          {post.published ? 'Unpublish' : 'Publish'}
                        </Button>
                        {post.published && (
                          <Button
                            as={Link}
                            to={`/post/${post._id}`}
                            variant="outline-info"
                            size="sm"
                            target="_blank"
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Recent Activity */}
      {stats.recentPosts && stats.recentPosts.length > 0 && (
        <Row className="mt-4">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Recent Posts</h6>
              </Card.Header>
              <Card.Body>
                {stats.recentPosts.slice(0, 5).map(post => (
                  <div key={post._id} className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <div className="fw-bold">{post.title}</div>
                      <small className="text-muted">{formatDateTime(post.createdAt)}</small>
                    </div>
                    <Badge bg={post.published ? 'success' : 'warning'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            {stats.popularPosts && stats.popularPosts.length > 0 && (
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Popular Posts</h6>
                </Card.Header>
                <Card.Body>
                  {stats.popularPosts.slice(0, 5).map(post => (
                    <div key={post._id} className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <div className="fw-bold">{post.title}</div>
                        <small className="text-muted">{post.views} views</small>
                      </div>
                      <Button
                        as={Link}
                        to={`/post/${post._id}`}
                        variant="outline-primary"
                        size="sm"
                        target="_blank"
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AdminDashboard;