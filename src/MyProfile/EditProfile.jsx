import React, { useState, useEffect, useRef } from "react";
import "./EditProfile.css";
import { FaCamera } from "react-icons/fa";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import axios from "axios";
import { baseUrl } from "../Url";
import Loder from "../Loder/Loder";

const EditProfile = () => {
  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const [viewUserRecipe, setViewUserRecipe] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    FavoriteFood: "",
    picture: { url: "", public_id: "" },
    pictureFile: null,
    coverPhoto: { url: "", public_id: "" },
    coverPhotoFile: null, // holds the file object for upload
  });

  const fileInputRef = useRef();
  const fileInputRefAvtar = useRef();

  // Handle input changes for name, email, FavoriteFood
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file change for cover photo
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        coverPhoto: { ...prev.coverPhoto, url: preview },
        coverPhotoFile: file,
      }));
    }
  };

  // Trigger file input
  const handleEditCoverClick = () => {
    fileInputRef.current.click();
  };

  // Fetch user recipes and user data
  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await axios.post(
          `${baseUrl}/api/user/upload/ViewRecipe`,
          { userId: user._id }
        );
        setViewUserRecipe(response.data?.payload?.recipe || []);
        setFormData((prevData) => ({ ...prevData, ...user }));
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      }
    };

    fetchUserRecipes();
  }, []);

  // Save profile changes
  const userProfileSaveChange = async () => {
    const file = fileInputRef.current.files[0];
    const avtar = fileInputRefAvtar.current.files[0];

    const formDataToSend = new FormData();
    formDataToSend.append("userId", user._id);
    formDataToSend.append("name", formData.name);
    // formDataToSend.append("email", formData.email);
    formDataToSend.append("FavoriteFood", formData.FavoriteFood);
    setLoading(true);
    if (file) {
      formDataToSend.append("coverPhoto", file); // Must match backend's key
    }
    if (avtar) {
      formDataToSend.append("avtarPhoto", avtar); // Must match backend's key
    }

    try {
      const response = await axios.put(
        `${baseUrl}/api/user/updateUser`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedUser = response.data.payload.updatedUser;
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setFormData((prev) => ({
        ...prev,
        ...updatedUser,
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Profile update error:", error);
    }
  };
  const handleEditAvtarClick = () => {
    fileInputRefAvtar.current.click();
  };
  const handleAvtarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        picture: { ...prev.picture, url: preview },
        pictureFile: file,
      }));
    }
  };

  return (
    <>
      <div className="profile-page">
        {loading && (
          <div className="loadingOverlay">
            <Loder loading={loading} />
          </div>
        )}
        {/* Cover Section */}
        <div className="cover-photo">
          <img
            src={
              formData.coverPhoto.url ||
              "https://marketplace.canva.com/EAFMUqABEj8/1/0/1600w/canva-pink-minimalist-motivational-quote-facebook-cover-4i1_4CirhhQ.jpg"
            }
            alt="cover"
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleCoverChange}
          />
          <button className="edit-cover" onClick={handleEditCoverClick}>
            <FaCamera /> Edit Cover
          </button>
        </div>

        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <img
              src={
                formData.picture.url ||
                "https://www.pngkit.com/png/detail/281-2812821_user-account-management-logo-user-icon-png.png"
              }
              alt="avatar"
              className="avatar"
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRefAvtar}
              onChange={handleAvtarChange}
            />
            <span className="edit-avatar" onClick={handleEditAvtarClick}>
              <FaCamera />
            </span>
          </div>
          <h2 className="profile-name">{formData.name || "Your Name"}</h2>
          <button className="save-changes" onClick={userProfileSaveChange}>
            Save changes
          </button>
        </div>

        {/* Personal Details */}
        <div className="personal-details">
          <h3>Personal Details</h3>
          <div className="details-grid">
            <div className="input-group">
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="input-group">
              <label>Favorite Food</label>
              <input
                name="FavoriteFood"
                value={formData.FavoriteFood}
                onChange={handleChange}
                placeholder="Enter favorite food"
              />
            </div>
            <div className="input-group">
              <label>Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                // onChange={handleChange}
                readOnly
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Recipes */}
      <div className="uploadedRecipes">
        <h2>Uploaded Recipes</h2>
        <div className="recipe-gallery">
          {viewUserRecipe.map((recipe) => (
            <div className="recipe-card" key={recipe._id}>
              <img src={recipe.imageUrl} alt={recipe.title} />
              <div className="recipe-info">
                <p>{recipe.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditProfile;
