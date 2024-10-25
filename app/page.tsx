// app/page.js
import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Your App</h1>
      <Link href="/dashboard">Go to Dashboard</Link>
    </div>
  );
};

export default Home;
