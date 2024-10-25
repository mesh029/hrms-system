import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Initialize as false

  useEffect(() => {
    // Function to update the isSmallScreen state
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    // Set the initial state only on the client side
    handleResize(); // Call it once to set the initial value

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #0072C6, #8B1F25)',
    padding: '15px 30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const logoStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const navStyle: React.CSSProperties = {
    display: isSmallScreen && !isMenuOpen ? 'none' : 'flex',
    flexDirection: isSmallScreen ? 'column' : 'row',
    gap: isSmallScreen ? '10px' : '30px',
    marginLeft: isSmallScreen ? '0' : 'auto',
  };

  const navLinkStyle: React.CSSProperties = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 500,
    position: 'relative',
  };

  const hamburgerStyle: React.CSSProperties = {
    display: isSmallScreen ? 'flex' : 'none',
    flexDirection: 'column',
    cursor: 'pointer',
    marginRight: '20px',
  };

  const lineStyle: React.CSSProperties = {
    width: '30px',
    height: '3px',
    backgroundColor: '#fff',
    margin: '4px 0',
    transition: '0.3s',
  };

  return (
    <header style={headerStyle}>
      <h1 style={logoStyle}>Path HRMS</h1>
      <div
        style={hamburgerStyle}
        onClick={() => setIsMenuOpen(prev => !prev)}
      >
        <div style={lineStyle}></div>
        <div style={lineStyle}></div>
        <div style={lineStyle}></div>
      </div>
      <nav style={navStyle}>
        <a style={navLinkStyle} href="#home">Home</a>
        <a style={navLinkStyle} href="#about">About</a>
        <a style={navLinkStyle} href="#contact">Contact</a>
      </nav>
      <input
        type="text"
        placeholder="Search..."
        style={{
          padding: '10px',
          borderRadius: '20px',
          border: 'none',
          outline: 'none',
          width: isSmallScreen ? '150px' : '200px',
          transition: 'width 0.3s',
        }}
        onFocus={(e) => (e.currentTarget.style.width = '250px')}
        onBlur={(e) => (e.currentTarget.style.width = isSmallScreen ? '150px' : '200px')}
      />
      <button style={{
        backgroundColor: '#fff',
        color: '#0072C6',
        border: 'none',
        borderRadius: '20px',
        padding: '10px 20px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
      }}>Login</button>
    </header>
  );
};

export default Header;
