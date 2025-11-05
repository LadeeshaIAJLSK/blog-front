import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer no-print">
      <Container>
        <div className="footer-content">
          <div className="footer-section">
            <h5 className="font-heading">{process.env.REACT_APP_SITE_NAME || 'My Blog'}</h5>
            <p>
              Sharing thoughts, experiences, and insights about technology, 
              programming, and life. Join me on this journey of continuous learning.
            </p>
          </div>
          
          <div className="footer-section">
            <h5 className="font-heading">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="interactive">Home</a>
              </li>
              <li className="mb-2">
                <a href="/about" className="interactive">About</a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="interactive">Contact</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5 className="font-heading">Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="interactive">Technology</a>
              </li>
              <li className="mb-2">
                <a href="#" className="interactive">Programming</a>
              </li>
              <li className="mb-2">
                <a href="#" className="interactive">Web Development</a>
              </li>
              <li className="mb-2">
                <a href="#" className="interactive">Tutorials</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5 className="font-heading">About</h5>
            <p>
              A personal blog focused on sharing knowledge and experiences in 
              technology, programming, and web development.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="mb-0">
            © 2025 My Blog. All rights reserved. Ladeesha Karunasinghe
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;