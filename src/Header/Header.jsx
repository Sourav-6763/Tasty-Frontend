import React, { useContext, useEffect, useRef, useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { PostList } from "../Store/AllStore";
import MyProfile from "../MyProfile/MyProfile";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const { UserLoggedInOrNot } = useContext(PostList);
  const [userIsLoggedIn, setuserIsLoggedIn] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null); // 📌 Reference for outside click detection

  const hambarClick = () => {
    setSidebar(!sidebar);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    const IsLoggedIn = sessionStorage.getItem("isLoggedIn");
    setuserIsLoggedIn(IsLoggedIn);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [UserLoggedInOrNot]);

  // 📌 Close profile on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setHovered(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="hambargerContainer" onClick={hambarClick}>
        <GiHamburgerMenu className="hambargerIcon hambargerIconVisible" />
      </div>
      {sidebar && (
        <div className="sidebar">
          <p>Home</p>
          <p>Contact Us</p>
          {userIsLoggedIn && user?.name ? (
            <p>{user.name}</p>
          ) : (
            <Link className="no-underline" to="/login">
              <p>Login</p>
            </Link>
          )}
          {userIsLoggedIn && (
            <Link to="/addRecipes" className="no-underline">
              <div className="addRepipe">
                <IoAddCircleOutline />
                <p className="addRecipePara">Add Recipe</p>
              </div>
            </Link>
          )}
        </div>
      )}

      <nav className="navbar">
        <h1 className="logo">
          <Link className="no-underline" to="/allRecipe">
            Tasty<span className="highlight">Treasure</span>
          </Link>
        </h1>

        <div className="nav-links">
          <p>Home</p>
          <p>Contact Us</p>
          {userIsLoggedIn && (
            <Link to="/addRecipes" className="no-underline">
              <div className="addRepipe">
                <IoAddCircleOutline />
                <p className="addRecipePara">Add Recipe</p>
              </div>
            </Link>
          )}

          {userIsLoggedIn ? (
            <div
              className="MyProfileWrapper"
              ref={profileRef} // 📌 Attach ref here
            >
              <p
                className="My profileSection"
                onClick={() => setHovered(!hovered)}
              >
                {user?.name}
              </p>
              {hovered && (
                <div className="myProfileArrow">
                  <IoMdArrowDropdown />
                </div>
              )}
              {hovered && (
                <div className="profile-dropdown">
                  <MyProfile />
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <p>Login</p>
            </Link>
          )}

          {/* <Link to="/Signup">
            <p>Signup</p>
          </Link> */}
        </div>
      </nav>
    </>
  );
};

export default Header;
