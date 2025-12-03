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
                <button className="interactive btn btn-link p-0 text-start text-decoration-none">About</button>
              </li>
              <li className="mb-2">
                <button className="interactive btn btn-link p-0 text-start text-decoration-none">Contact</button>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5 className="font-heading">Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <button className="interactive btn btn-link p-0 text-start text-decoration-none">Technology</button>
              </li>
              <li className="mb-2">
                <button className="interactive btn btn-link p-0 text-start text-decoration-none">Programming</button>
              </li>
              <li className="mb-2">
                <button className="interactive btn btn-link p-0 text-start text-decoration-none">Web Development</button>
              </li>
              <li className="mb-2">
                <button className="interactive btn btn-link p-0 text-start text-decoration-none">Tutorials</button>
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