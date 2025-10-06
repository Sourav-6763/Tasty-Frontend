import React, { useEffect, useState } from 'react';
import './MyProfile.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../Url';

const MyProfile = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [edit, setEdit] = useState(false);
  const [userDetails, setUserDetails] = useState({});
 



  return (
    <div className="profile-container">
      <div className="profile-card">
        <img className="profile-avatar" src={user.picture.url ||"/HomePageImage/noImage.jpg"} alt="Avatar"  referrerPolicy="no-referrer" />
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p className="profile-bio">Recipe Post : { user.recipe.length||"null"}</p>
          </div>
 
        <Link to='/editProfile'><button className="profile-btn">
          Edit
        </button></Link>
      </div>
    </div>
  );
};

export default MyProfile;
