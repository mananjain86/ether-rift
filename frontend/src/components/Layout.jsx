import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className="min-h-screen w-full bg-gradient-to-br from-black via-cyan-950 to-pink-950 text-white font-sans relative overflow-x-hidden">
    {/* Animated neon background */}
    <div className="fixed inset-0 -z-10">
      {/* Layered gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-cyan-900/60 to-pink-900/60 animate-gradient-x" />
      {/* Floating neon shapes */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-cyan-400 opacity-20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 opacity-20 rounded-full blur-2xl animate-float-fast" />
      <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-green-400 opacity-10 rounded-full blur-2xl animate-float-mid" />
    </div>
    <Navbar />
    <main className="pt-24 w-full">
      {children}
    </main>
  </div>
);

export default Layout; 