import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const ImageDebugger = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/posts?limit=1');
        setPosts(response.data.posts || []);
        console.log('Posts data:', response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px' }}>
      <h3>Image Debug Information</h3>
      
      <div>
        <h4>Environment Variables:</h4>
        <p><strong>REACT_APP_API_URL:</strong> {process.env.REACT_APP_API_URL}</p>
      </div>

      {posts.map(post => (
        <div key={post._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', backgroundColor: 'white' }}>
          <h4>Post: {post.title}</h4>
          <p><strong>Featured Image Path:</strong> {post.featuredImage || 'No image'}</p>
          <p><strong>Old Constructed URL:</strong> {post.featuredImage ? `${process.env.REACT_APP_API_URL}/${post.featuredImage}` : 'No URL'}</p>
          <p><strong>New Constructed URL:</strong> {getImageUrl(post.featuredImage) || 'No URL'}</p>
          
          {post.featuredImage && (
            <div>
              <h5>Image Test:</h5>
              <img
                src={getImageUrl(post.featuredImage)}
                alt="Debug test"
                style={{ maxWidth: '200px', border: '2px solid red' }}
                onError={(e) => {
                  console.error('Image load error:', e);
                  e.target.style.border = '2px solid red';
                  e.target.nextSibling.textContent = 'FAILED TO LOAD';
                  e.target.nextSibling.style.color = 'red';
                }}
                onLoad={(e) => {
                  console.log('Image loaded successfully');
                  e.target.style.border = '2px solid green';
                  e.target.nextSibling.textContent = 'LOADED SUCCESSFULLY';
                  e.target.nextSibling.style.color = 'green';
                }}
              />
              <p style={{ marginTop: '10px' }}>Status: Loading...</p>
              
              <div style={{ marginTop: '10px' }}>
                <h6>Direct URL Test:</h6>
                <a 
                  href={getImageUrl(post.featuredImage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  Open image in new tab
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageDebugger;