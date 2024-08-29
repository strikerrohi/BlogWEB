"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiFillBook,
  AiOutlineBook,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Article = {
  id: string;
  title: string;
  link: string;
  author: string;
  preview: string;
  isLiked: boolean;
  isBookmarked: boolean;
  category: "Technical" | "Non-Technical" | "Other";
};

const MainContent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchArticles = async () => {
    try {
      const response = await axios.get(
        "https://v1.nocodeapi.com/sourav_09/medium/GwiOVUQjnJVWzkme"
      );
      const fetchedArticles = response.data.map(
        (article: Omit<Article, 'id' | 'isLiked' | 'isBookmarked' | 'category'>, index: number) => ({
          ...article,
          id: uuidv4(), // Generate a unique ID for each article
          isLiked: false,
          isBookmarked: false,
          category: "Technical", // Default category, update as necessary
        })
      );
      setArticles(fetchedArticles);
      setFilteredArticles(fetchedArticles);

      // Store the fetched articles in localStorage
      localStorage.setItem("articles", JSON.stringify(fetchedArticles));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const toggleLike = (id: string) => {
    setArticles((prevArticles) => {
      const updatedArticles = prevArticles.map((article) =>
        article.id === id ? { ...article, isLiked: !article.isLiked } : article
      );
      const likedArticle = updatedArticles.find((article) => article.id === id);
      const likedCount = parseInt(localStorage.getItem("likedCount") || "0", 10);
  
      let likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");
  
      if (likedArticle?.isLiked) {
        localStorage.setItem("likedCount", (likedCount + 1).toString());
        likedArticles.push(likedArticle);
        toast.success("Article liked!");
      } else {
        localStorage.setItem("likedCount", (likedCount - 1).toString());
        likedArticles = likedArticles.filter((article: Article) => article.id !== id);
        toast.error("Article disliked!");
      }
  
      // Update the likedArticles array in localStorage
      localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
  
      // Store the updated articles list in localStorage
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
  
      return updatedArticles;
    });
  };
  
  const toggleBookmark = (id: string) => {
    setArticles((prevArticles) => {
      const updatedArticles = prevArticles.map((article) =>
        article.id === id
          ? { ...article, isBookmarked: !article.isBookmarked }
          : article
      );
      const bookmarkedArticle = updatedArticles.find((article) => article.id === id);
      const bookmarkedCount = parseInt(
        localStorage.getItem("bookmarkedCount") || "0",
        10
      );
  
      let bookmarkedArticles = JSON.parse(localStorage.getItem("bookmarkedArticles") || "[]");
  
      if (bookmarkedArticle?.isBookmarked) {
        localStorage.setItem("bookmarkedCount", (bookmarkedCount + 1).toString());
        bookmarkedArticles.push(bookmarkedArticle);
        toast.success("Article bookmarked!");
      } else {
        localStorage.setItem("bookmarkedCount", (bookmarkedCount - 1).toString());
        bookmarkedArticles = bookmarkedArticles.filter((article: Article) => article.id !== id);
        toast.error("Article unbookmarked!");
      }
  
      // Update the bookmarkedArticles array in localStorage
      localStorage.setItem("bookmarkedArticles", JSON.stringify(bookmarkedArticles));
  
      // Store the updated articles list in localStorage
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
  
      return updatedArticles;
    });
  };
  

  useEffect(() => {
    if (searchQuery) {
      setFilteredArticles(
        articles.filter((article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredArticles(articles);
    }
  }, [searchQuery, articles]);

  return (
    <section id="main" className="text-gray-600 mt-0 body-font relative bg-gradient-to-r from-blue-100 to-blue-200">
      <ToastContainer />


      <h1 className="text-center font-bold text-4xl mt-2 mb-2">Latest Posts</h1>

      <div className="container px-5 py-10 mx-auto">
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <Input
            type="text"
            placeholder="Search posts by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-lg p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap -m-4">
          {loading ? (
            <p className="text-center text-gray-500 w-full">
              Loading articles...
            </p>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.id} className="p-5 lg:w-1/3 w-full">
                <Card className="h-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xs font-medium text-gray-400 mb-1 uppercase">
                      {article.author}
                    </CardTitle>
                    <CardTitle className="sm:text-2xl text-xl font-medium text-white mb-3">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed mb-3">
                      {article.preview}
                    </CardDescription>
                    <Link
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 inline-flex items-center cursor-pointer"
                    >
                      Learn More
                      <svg
                        className="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-gray-400 text-sm mt-4">
                    <div className="flex space-x-4">
                      {/* Like/Dislike Button */}
                      <button onClick={() => toggleLike(article.id)}>
                        {article.isLiked ? (
                          <AiFillHeart className="text-red-500 w-6 h-6" />
                        ) : (
                          <AiOutlineHeart className="text-gray-400 w-6 h-6" />
                        )}
                      </button>
                      {/* Bookmark/Unbookmark Button */}
                      <button onClick={() => toggleBookmark(article.id)}>
                        {article.isBookmarked ? (
                          <AiFillBook className="text-yellow-500 w-6 h-6" />
                        ) : (
                          <AiOutlineBook className="text-gray-400 w-6 h-6" />
                        )}
                      </button>
                    </div>
                    <div className="inline-flex flex-col items-center">
                      <Link href="/comments">
                        <svg
                          className="w-4 h-4 mr-1"
                          stroke="currentColor"
                          strokeWidth={2}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                        </svg>
                        Add Comments
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">
              No articles found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainContent;
