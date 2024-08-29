"use client";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const Dashboard = () => {
  const [likedCount, setLikedCount] = useState<number>(0);
  const [bookmarkedCount, setBookmarkedCount] = useState<number>(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [likedArticles, setLikedArticles] = useState<Article[]>([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);

  useEffect(() => {
    const storedLikedCount = localStorage.getItem("likedCount");
    const storedBookmarkedCount = localStorage.getItem("bookmarkedCount");
    const storedArticles = localStorage.getItem("articles");
    const storedLikedArticles = localStorage.getItem("likedArticles");
    const storedBookmarkedArticles = localStorage.getItem("bookmarkedArticles");

    if (storedLikedCount) setLikedCount(parseInt(storedLikedCount, 10));
    if (storedBookmarkedCount)
      setBookmarkedCount(parseInt(storedBookmarkedCount, 10));
    if (storedArticles) setArticles(JSON.parse(storedArticles));
    if (storedLikedArticles) setLikedArticles(JSON.parse(storedLikedArticles));
    if (storedBookmarkedArticles)
      setBookmarkedArticles(JSON.parse(storedBookmarkedArticles));
  }, []);

  const handleAddPost = async () => {
    const formData = new FormData();
    formData.append("title", newPostTitle);
    formData.append("content", newPostContent);
    if (newPostImage) {
      formData.append("image", newPostImage);
    }

    const response = await fetch("http://127.0.0.1:8000/api/posts/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const newPost = await response.json();
      console.log("New Post Added:", newPost);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImage(null);
    } else {
      console.error("Failed to add post");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewPostImage(e.target.files[0]);
      setNewPostImage(null);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <Card className="mb-8 shadow-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="text-5xl font-bold text-center mb-4">
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <p className="text-3xl text-center">
            <span className="font-semibold">Liked Articles: </span>
            {likedCount}
          </p>
          <p className="text-3xl text-center">
            <span className="font-semibold">Bookmarked Articles: </span>
            {bookmarkedCount}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="liked" className="mb-8">
        <TabsList className="justify-center space-x-6">
          <TabsTrigger
            value="liked"
            className="px-6 py-3 rounded-full font-semibold text-lg transition-colors duration-300 bg-white text-indigo-600 hover:bg-indigo-100 shadow-md"
          >
            Liked Articles
          </TabsTrigger>
          <TabsTrigger
            value="bookmarked"
            className="px-6 py-3 rounded-full font-semibold text-lg transition-colors duration-300 bg-white text-purple-600 hover:bg-purple-100 shadow-md"
          >
            Bookmarked Articles
          </TabsTrigger>
          <TabsTrigger
            value="addPost"
            className="px-6 py-3 rounded-full font-semibold text-lg transition-colors duration-300 bg-white text-pink-600 hover:bg-pink-100 shadow-md"
          >
            Add a Blog Post
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liked" className="grid grid-cols-1 gap-8">
          {articles
            .filter((article) => article.isLiked)
            .map((article) => (
              <Card
                key={article.id}
                className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white text-gray-900 rounded-lg"
              >
                <CardHeader className="border-b-2 border-gray-200">
                  <CardTitle className="text-2xl font-semibold">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{article.preview}</p>
                </CardContent>
                <CardFooter>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Read More
                  </a>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="bookmarked" className="grid grid-cols-1 gap-8">
          {articles
            .filter((article) => article.isBookmarked)
            .map((article) => (
              <Card
                key={article.id}
                className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white text-gray-900 rounded-lg"
              >
                <CardHeader className="border-b-2 border-gray-200">
                  <CardTitle className="text-2xl font-semibold">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{article.preview}</p>
                </CardContent>
                <CardFooter>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    Read More
                  </a>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="addPost" className="grid grid-cols-1 gap-6">
          <Card className="shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white text-gray-900 rounded-lg">
            <CardHeader className="border-b-2 border-gray-200">
              <CardTitle className="text-2xl font-semibold">
                Add a New Blog Post
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Post Title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Textarea
                placeholder="Post Content (Markdown Supported)"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <ReactMarkdown className="prose">
                {newPostContent}
              </ReactMarkdown>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleAddPost}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                Add Post
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
