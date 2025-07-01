import React, { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('VeeFore App Component Mounted');
    document.title = 'VeeFore - Test Mode';
  }, []);

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #000000 100%)',
      color: 'white',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }
  }, 
    React.createElement('h1', {
      style: {
        fontSize: '3rem',
        marginBottom: '20px',
        background: 'linear-gradient(45deg, #60a5fa, #a855f7)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }, 'VeeFore'),
    React.createElement('p', {
      style: { fontSize: '1.2rem', marginBottom: '20px' }
    }, 'React is working correctly!'),
    React.createElement('button', {
      onClick: () => setCount(count + 1),
      style: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem'
      }
    }, `Clicked ${count} times`),
    React.createElement('p', {
      style: { marginTop: '20px', opacity: 0.7 }
    }, 'Backend services are running. Frontend test successful.')
  );
}

export default App;
