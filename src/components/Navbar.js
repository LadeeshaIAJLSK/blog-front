import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold">
          {process.env.REACT_APP_SITE_NAME || 'My Blog'}
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Nav.Link as={Link} to="/admin/dashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/create-post">
                      Create Post
                    </Nav.Link>
                  </>
                )}
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <span className="navbar-text me-2">
                  Welcome, {user.username}
                </span>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;