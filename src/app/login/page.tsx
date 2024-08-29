"use client";
import LoginForm from '@/components/Login'
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type Props = {}

const Page = (props: Props) => {
  const [username,setName]=useState("")
  const [password,setPassword]=useState("");
  const router=useRouter();

  const handleSubmit=async(e:any)=>{
    e.preventDefault()
    console.log(username,password)

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
      username,
      password
      });
      console.log(response)
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);


      if (response.status === 200) {
        // Redirect to the homepage on successful login
        router.push('/');
      }
    }
    catch(error:any){
      console.log("error",error)
    }
  }
  
  return (
<div className="flex justify-center items-center min-h-screen bg-[#080710]">
      <div className="relative w-[430px] h-[520px]">
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#1845ad] to-[#23a2f6] rounded-full -left-20 -top-20"></div>
        <div className="absolute w-[200px] h-[200px] bg-gradient-to-r from-[#ff512f] to-[#f09819] rounded-full -right-10 -bottom-20"></div>
      </div>
      <form onSubmit={handleSubmit} className="relative w-[400px] h-[520px] bg-white bg-opacity-10 backdrop-blur-lg border-2 border-white border-opacity-10 shadow-2xl p-12 rounded-lg">
        <h3 className="text-center text-3xl font-medium text-white mb-8">Login Here</h3>

        <label htmlFor="username" className="block text-white text-base font-medium mt-6">
          Username
        </label>
        <input
          type="text"
          placeholder="Email or Phone"
          id="username"
          onChange={(e)=>setName(e.target.value)}
          className="w-full h-12 mt-2 bg-white bg-opacity-10 text-white placeholder-gray-200 rounded px-3"
        />

        <label htmlFor="password" className="block text-white text-base font-medium mt-6">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={(e)=>setPassword(e.target.value)}

          className="w-full h-12 mt-2 bg-white bg-opacity-10 text-white placeholder-gray-200 rounded px-3"
        />

        <button className="w-full h-12 mt-12 bg-green-400 text-[#080710] font-semibold text-lg rounded cursor-pointer">
          Log In
        </button>

        <div className="text-center mt-8 text-white">
          Don&apos;t have an account? <Link href="/register" className="text-green-400 font-medium">Create an Account</Link>
        </div>
      </form>
    </div>  )
}

export default Page