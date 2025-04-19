import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const CommentSection = ({ eventId, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/api/comments/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err));
  }, [eventId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/api/comments/event/${eventId}`,
        { content: newComment },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Комментарии</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Оставьте комментарий..."
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Отправить
        </button>
      </form>
      <div>
        {comments.length ? (
          comments.map((comment) => (
            <div key={comment._id} className="mb-4 p-4 border-b border-gray-200">
              <p className="text-gray-800">{comment.content}</p>
              <span className="text-gray-500 text-xs">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Комментариев пока нет.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
