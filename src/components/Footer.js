import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h5>{process.env.REACT_APP_SITE_NAME || 'My Blog'}</h5>
            <p className="text-muted">
              Sharing thoughts, experiences, and insights.
            </p>
          </Col>
          <Col md={6}>
            <h6>Connect</h6>
            <p className="text-muted">
              Follow me on social media for updates.
            </p>
          </Col>
        </Row>
        <hr className="text-muted" />
        <Row>
          <Col className="text-center">
            <p className="text-muted mb-0">
              © {new Date().getFullYear()} {process.env.REACT_APP_SITE_NAME || 'My Blog'}. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;