import React, { useEffect, useState } from "react";
import "./UserComment.css";
import axios from "axios";
import { baseUrl } from "../Url";
import { toast, Toaster } from "sonner";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

function UserComment({ recipeId }) {
  const [newComment, setNewComment] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  // const [reload, SetReload] = useState(false);
  const [comments, setComments] = useState([]);

  const handleAdd = async () => {
    if (!user._id) {
      toast.warning("Please log in to comment this recipe");
      return;
    }
    const response = await axios.post(
      `${baseUrl}/api/user/upload/comment/${recipeId}`,
      {
        newComment,
        userId: user._id,
      }
    );
    setNewComment("");
    fetchComment();
  };
  //  console.log(user._id);

  const fetchComment = async () => {
    const response = await axios.post(
      `${baseUrl}/api/user/upload/comment/useruploadRecipe/${recipeId}`
    );
    setComments(response.data.payload.recipe.comment);
  };

  useEffect(() => {
    fetchComment();
  }, [recipeId]);

  const handleLike = async (commentId) => {
    if (!user._id) {
      toast.warning("Please log in to like this comment");
      return;
    }

    await axios.post(
      `${baseUrl}/api/user/upload/comment/useruploadRecipe/Like/${recipeId}`,
      {
        UserId: user._id,
        CommentId: commentId,
      }
    );

    fetchComment();
  };

  return (
    <div className="comment-box">
      <Toaster position="top-right" richColors />
      {/* Input */}
      <div className="comment-input">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={() => handleAdd()}>Post</button>
      </div>

      {/* Comment List */}
      <div className="comment-list">
        {comments.map((c, i) => (
          <div key={i} className="comment-item">
            {c.user && (
              <img
                src={c.user.picture}
                alt={c.user.name}
                className="avatarForComment"
              />
            )}
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-user">
                  {c.user ? c.user.name : "Unknown User"}
                </span>
                <span className="comment-time">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="comment-text">{c.text}</p>
              <div className="comment-actions">
                <span onClick={() => handleLike(c._id)}>
                  {c.Likes?.includes(user._id) ? <BiSolidLike /> : <BiLike />}{" "}
                  {c.Likes.length}
                </span>
                <span>Reply</span> · <span>Share</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserComment;
