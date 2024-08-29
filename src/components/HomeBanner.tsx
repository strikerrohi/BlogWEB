"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import "./Home.css";
import Image from 'next/image';

const HomeBanner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  
  useEffect(() => {
    const loggedUser = localStorage.getItem("username");
    if (loggedUser) {
      setIsLoggedIn(true);
      setUsername(loggedUser);
    }
  }, []);

  return (
    <section id='main' className=" relative mb-0 bg-gradient-to-r from-blue-100 to-blue-200">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images.jpeg" 
          alt="Background" 
          width={400}
          height={500}
          className="w-full h-full object-cover opacity-50" 
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-blue-900 opacity-75"></div>

      <div className="relative z-10 mx-auto max-w-screen-xl px-6 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold sm:text-7xl text-black leading-tight mb-10">
            Discover and Share Your Passions
          </h1>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <h2 className="text-2xl font-bold text-blue-900">Create Your Blog</h2>
              <p className="mt-2 text-blue-700">
                Share your thoughts and ideas with the world. Start your own blog today!
              </p>
              <Link 
                href="/dashboard" 
                className="mt-4 inline-block text-blue-600 hover:text-blue-500"
              >
                Get Started →
              </Link>
            </div>

            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <h2 className="text-2xl font-bold text-blue-900">Explore Content</h2>
              <p className="mt-2 text-blue-700">
                Dive into a vast library of articles, stories, and tutorials across various topics.
              </p>
              <Link 
                href="#explore" 
                className="mt-4 inline-block text-blue-600 hover:text-blue-500"
              >
                Explore Now →
              </Link>
            </div>

            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <h2 className="text-2xl font-bold text-blue-900">Join the Community</h2>
              <p className="mt-2 text-blue-700">
                Connect with like-minded individuals, join discussions, and expand your network.
              </p>
              <Link 
                href="#contact" 
                className="mt-4 inline-block text-blue-600 hover:text-blue-500"
              >
                Join Us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeBanner;
