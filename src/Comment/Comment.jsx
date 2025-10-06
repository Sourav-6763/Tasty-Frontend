import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../Url";
import "./Comment.css";

const Comment = () => {
  const [comment, setComment] = useState("");
  const [ViewComment, ViewSetComment] = useState([]);
  const [postRefresh, setPostRefresh] = useState(true);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const ViewItem = JSON.parse(sessionStorage.getItem("ViewItem"));

  const commentPostHandel = async (e) => {
    e.preventDefault();
    await axios.post(`${baseUrl}/api/recipe/userComment`, {
      userId: user._id,
      RecipeId: ViewItem.payload.information.id,
      comment,
    });
    setComment("");
    setPostRefresh(!postRefresh);
  };

  useEffect(() => {
    const getViewPost = async () => {
      const response2 = await axios.post(
        `${baseUrl}/api/recipe/ViewuserComment`,
        {
          RecipeId: ViewItem.payload.information.id,
        }
      );
      ViewSetComment(response2.data.payload.record);
    };
    getViewPost();
  }, [postRefresh]);
  const [showAll, setShowAll] = useState(6);

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <form className="comment-form" onSubmit={commentPostHandel}>
        <textarea
          placeholder="Write a comment..."
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit" disabled={!comment.trim()}>
          Post
        </button>
      </form>
      <div className="comment-list">
        {ViewComment.length > 0 ? (
          ViewComment.slice(0, showAll).map((e) => (
            <div className="comment" key={e._id}>
              <div className="comment-avatar">
                <img
                  src={
                    e.user?.picture ||
                    "https://static.vecteezy.com/system/resources/previews/022/123/337/original/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg"
                  }
                  alt="avatar"
                />
              </div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-user">
                    {e.user?.name || "User Name"}
                  </span>
                  <span className="comment-badge">Top Comment</span>
                  <span className="comment-time">
                    {new Date(e.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="comment-text">{e.content}</p>
                <div className="comment-footer">
                  <span className="comment-like">❤️ {e.likes || 0}</span>
                  <span className="comment-reply">💬 Reply</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        {ViewComment.length > showAll && (
          <p
            className="see-more"
            onClick={() => setShowAll((prev) => prev + 5)}
          >
            See More
          </p>
        )}
      </div>
    </div>
  );
};

export default Comment;
