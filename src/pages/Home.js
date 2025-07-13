import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Pagination, Alert } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [sidebar, setSidebar] = useState({ categories: [], popularTags: [] });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, selectedCategory, currentPage, sortBy]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        sort: sortBy
      };

      const response = await api.get('/api/posts', { params });
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
      setSidebar(response.data.sidebar);
      setError('');
    } catch (error) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner message="Loading posts..." />;
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Welcome to My Blog
              </h1>
              <p className="lead mb-4">
                Sharing thoughts, experiences, and insights about technology, life, and everything in between.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row>
          <Col lg={8}>
            {/* Search and Filters */}
            <Row className="mb-4">
              <Col md={6}>
                <Form onSubmit={handleSearch}>
                  <Form.Control
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">All Categories</option>
                  {sidebar.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="title">By Title</option>
                </Form.Select>
              </Col>
            </Row>

            {/* Posts Grid */}
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <h3>No posts found</h3>
                <p className="text-muted">
                  {searchTerm || selectedCategory ? 
                    'Try adjusting your search criteria.' : 
                    'Check back later for new content!'
                  }
                </p>
              </div>
            ) : (
              <>
                <Row>
                  {posts.map(post => (
                    <Col md={6} lg={4} key={post._id} className="mb-4">
                      <PostCard post={post} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <Pagination>
                      <Pagination.Prev
                        disabled={!pagination.hasPrev}
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                      
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <Pagination.Item
                              key={page}
                              active={page === currentPage}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Pagination.Item>
                          );
                        }
                        return null;
                      })}
                      
                      <Pagination.Next
                        disabled={!pagination.hasNext}
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Categories Widget */}
            <Card className="sidebar-widget">
              <Card.Header>
                <h5 className="mb-0">Categories</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  {sidebar.categories.map(category => (
                    <button
                      key={category}
                      className={`btn btn-outline-primary btn-sm ${
                        selectedCategory === category ? 'active' : ''
                      }`}
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category ? '' : category);
                        setCurrentPage(1);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Popular Tags Widget */}
            {sidebar.popularTags.length > 0 && (
              <Card className="sidebar-widget">
                <Card.Header>
                  <h5 className="mb-0">Popular Tags</h5>
                </Card.Header>
                <Card.Body>
                  <div className="tag-cloud">
                    {sidebar.popularTags.map(tag => (
                      <span
                        key={tag.name}
                        className="badge bg-light text-dark me-1 mb-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSearchTerm(tag.name);
                          setCurrentPage(1);
                        }}
                      >
                        #{tag.name} ({tag.count})
                      </span>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* About Widget */}
            <Card className="sidebar-widget">
              <Card.Header>
                <h5 className="mb-0">About</h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted">
                  Welcome to my personal blog where I share my thoughts and experiences 
                  about technology, programming, and life in general.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;