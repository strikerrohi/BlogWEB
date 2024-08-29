"use client";
import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Props = {}

const Page = (props: Props) => {
  const router = useRouter();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("request reached");

    if (password !== cpassword) {
      console.error('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        username,
        email,
        password,
      });
      router.push('/login');  // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#080710]">
      <div className="relative w-[430px] h-[520px]">
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#1845ad] to-[#23a2f6] rounded-full -left-20 -top-20"></div>
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full -right-10 -bottom-20"></div>
      </div>
      <form onSubmit={handleSubmit} className="relative w-[500px] h-[700px] bg-white bg-opacity-10 backdrop-blur-lg border-2 border-white border-opacity-10 shadow-2xl p-12 rounded-lg">
        <h3 className="text-center text-3xl font-medium text-white mb-8">Register Here</h3>

        <label htmlFor="username" className="block text-white text-base font-medium mt-6">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          id="username"
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 mt-2 bg-white bg-opacity-10 text-white placeholder-gray-200 rounded px-3"
        />

        <label htmlFor="email" className="block text-white text-base font-medium mt-6">
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 mt-2 bg-white bg-opacity-10 text-white placeholder-gray-200 rounded px-3"
        />

        <label htmlFor="password" className="block text-white text-base font-medium mt-6">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 mt-2 bg-white bg-opacity-10 text-white placeholder-gray-200 rounded px-3"
        />

        <label htmlFor="confirm-password" className="block text-white text-base font-medium mt-6">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm Password"
          id="confirm-password"
          onChange={(e) => setCPassword(e.target.value)}
          className="w-full h-12 mt-2 bg-white bg-opacity-10 text-white placeholder-gray-200 rounded px-3"
        />

        <button type="submit" className="w-full h-12 mt-12 bg-green-400 text-[#080710] font-semibold text-lg rounded cursor-pointer">
          Register
        </button>

        <div className="text-center mt-8 text-white">
          Already have an account? <Link href="/login" className="text-green-400 font-medium">Login Here</Link>
        </div>
      </form>
    </div>
  )
}

export default Page;
