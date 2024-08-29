"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import Link from 'next/link';

interface Reply {
  id: number;
  reply: string;
  created_at: string;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  comment: string;
  created_at: string;
  replies: Reply[];
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: number]: boolean }>({});
  const[name,setName]=useState<string |null>("")
  const[email,setEmail]=useState<string |null>("")

  useEffect(() => {
    // Initialize EasyMDE
    // new EasyMDE({ element: document.getElementById('comment-textarea')! });
    const username = localStorage.getItem("username"); 
    setName(username)
    const email = localStorage.getItem("email"); 
    setEmail(email)
    // Fetch comments from Django backend
    axios.get<Comment[]>('http://127.0.0.1:8000/api/comments/')
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the comments!', error);
      });
  }, []);

  const handleAddComment = async(e: React.FormEvent<HTMLFormElement>) => {
    console.log("comment added",commentText)
    e.preventDefault();
    // Post new comment to Django backend
    await axios.post<Comment>('http://127.0.0.1:8000/api/comments/', {
      name: name,
      email:email,
      comment: commentText,
     
    })
      .then(response => {
        setComments([...comments, response.data]);
        setCommentText('');
      })
      .catch(error => {
        console.error('There was an error adding the comment!', error);
      });
  };

  const handleReply = async(e: React.FormEvent<HTMLFormElement>, commentId: number) => {
    e.preventDefault();
    // Post reply to Django backend
    await axios.post<Reply>(`http://127.0.0.1:8000/api/comments/${commentId}/reply/`, {
      
      reply: replyText[commentId],
      
    })
      .then(response => {
        setComments(comments.map(comment =>
          comment.id === commentId ? { ...comment, replies: [...comment.replies, response.data] } : comment
        ));
        setReplyText({ ...replyText, [commentId]: '' });
      })
      .catch(error => {
        console.error('There was an error adding the reply!', error);
      });
  };

  const toggleReplyForm = (commentId: number) => {
    setShowReplyForm({
      ...showReplyForm,
      [commentId]: !showReplyForm[commentId],
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Comments</h1>

      {/* Add Comment Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add a Comment</h2>
        <form id="comment-form" onSubmit={handleAddComment} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <textarea
            name="comment"
            id="comment-textarea"
            rows={4}
            placeholder="Add your comment here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit Comment
          </button>
        </form>
      </div>

      <ul className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="bg-white p-6 rounded shadow-md">
              <div className="mb-2">
                <strong className="text-lg">{comment.name}</strong> <span className="text-gray-600">({comment.email})</span>
              </div>
              <div className="text-gray-800 mb-2">{comment.comment}</div>
              <div className="text-sm text-gray-500 mb-4">
                <em>{comment.created_at}</em>
              </div>
              <button
                className="text-blue-500 hover:text-blue-700 font-semibold"
                onClick={() => toggleReplyForm(comment.id)}
              >
                Reply
              </button>
              {showReplyForm[comment.id] && (
                <div className="mt-4">
                  <form
                    onSubmit={(e) => handleReply(e, comment.id)}
                    className="bg-gray-50 p-4 rounded shadow-inner"
                  >
                    <textarea
                      name="reply"
                      rows={2}
                      placeholder="Add your reply here..."
                      value={replyText[comment.id] || ''}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [comment.id]: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Submit Reply
                    </button>
                  </form>
                </div>
              )}
              <ul className="mt-4 space-y-2">
                {comment.replies.length > 0 ? (
                  comment.replies.map((reply) => (
                    <li key={reply.id} className="bg-gray-100 p-4 rounded shadow-inner">
                      {reply.reply}
                      <div className="text-sm text-gray-500 mt-2">
                        <em>{reply.created_at}</em>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No replies yet.</li>
                )}
              </ul>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No comments yet.</li>
        )}
      </ul>

      
    </div>
  );
};

export default Comments;
