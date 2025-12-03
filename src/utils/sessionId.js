// Generate a unique session ID for this browser session
const generateSessionId = () => {
  // Try to get existing session ID from localStorage
  let sessionId = localStorage.getItem('blogSessionId');
  
  if (!sessionId) {
    // Create a new session ID using current time + random number + browser info
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2);
    const browserInfo = (navigator.userAgent + navigator.language + window.screen.width + window.screen.height).replace(/[^a-zA-Z0-9]/g, '');
    
    sessionId = `${timestamp}_${randomStr}_${browserInfo.substring(0, 20)}`;
    localStorage.setItem('blogSessionId', sessionId);
  }
  
  return sessionId;
};

export const getSessionId = () => {
  return generateSessionId();
};

const sessionIdExport = { getSessionId };
export default sessionIdExport;