// Login.js
import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PostList } from "../Store/AllStore";
import { baseUrl } from "../Url";
import { Toaster, toast } from "sonner";
import Skeleton from "@mui/material/Skeleton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserLoggedInOrNot, setUserLoggedData, activeTab, setActiveTab } =
    useContext(PostList);
  const [iconsLoaded, setIconsLoaded] = useState({
    gmail: false,
    facebook: false,
    twitter: false,
  });
  const [socialLoading, setSocialLoading] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    try {
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        email,
        password,
      });
      const token = response?.data?.payload?.token;
      const user = response?.data?.payload?.user;

      if (token) {
        toast.success("Login successful");
        setUserLoggedInOrNot(true);
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("isLoggedIn", true);

        setTimeout(() => {
          navigate("/AllRecipe");
        }, 1000);
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message);
      }
    }
  };

  const handleLoginSuccess = async (tokenResponse) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = await axios.post(`${baseUrl}/api/auth/google`, {
        code: tokenResponse.code,
      });

      toast.success("Login successful!");
      setUserLoggedInOrNot(true);
      sessionStorage.setItem("user", JSON.stringify(res.data.payload.user));
      sessionStorage.setItem("isLoggedIn", true);

      setTimeout(() => {
        navigate("/AllRecipe");
      }, 1000);
    } catch (error) {
      console.error("Login processing error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleLoginError = (error) => {
    console.error("Google Login Error:", error);
    toast.error("Google login failed.");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
    flow: "auth-code",
  });

  const signinHandeler = () => {
    setActiveTab("signin");
    navigate("/login");
  };

  const signunHandeler = () => {
    setActiveTab("signup");
    navigate("/signup");
  };

  useEffect(() => {
    const allLoaded =
      iconsLoaded.gmail && iconsLoaded.facebook && iconsLoaded.twitter;
    if (allLoaded) {
      setSocialLoading(false);
    }
  }, [iconsLoaded]);

  return (
    <div className="loginContainer">
      <Toaster richColors position="top-right" />

      {/* Background Image */}
      <img
        className="loginBackgroundImage"
        src="./HomePageImage/Imported Food Fruit.jpeg"
        alt="Login"
      />

      {/* Optional dark overlay */}
      <div className="backgroundOverlay" />

      <div className="login-card">
        <img
          className="loginBackgroundImageForSmallScreen"
          src="./HomePageImage/loginpagebackground.png"
          alt="Login"
        />

        <div className="signInAndSignupContainer">
          <div
            className={`tab ${activeTab === "signin" ? "active" : ""}`}
            onClick={signinHandeler}
          >
            Signin
          </div>
          <div
            className={`tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={signunHandeler}
          >
            Signup
          </div>
          <div className={`underline ${activeTab}`} />
        </div>

        <p className="loginPara">
          More than <span className="highlight">3,500</span> recipes from around the world!
        </p>

        <form className="loginFrom" onSubmit={handleLogin}>
          <div className="phonNumberField">
            <label htmlFor="email">Enter Email</label>
            <input
              type="email"
              placeholder="Enter Email Address"
              className="input-field"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="passwordField">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="social-login">
          <p>Or Login with</p>
          <div className="social-login-container">
            <div
              style={{ display: socialLoading ? "flex" : "none" }}
              className="sceletonContainer"
            >
              <Skeleton variant="circular" className="socialIconSceleton" />
              <Skeleton variant="circular" className="socialIconSceleton" />
              <Skeleton variant="circular" className="socialIconSceleton" />
            </div>

            <div className="socialiconinside" style={{ display: socialLoading ? "none" : "flex"     }}>
              <button className="social-btn gmail" onClick={googleLogin}>
                <img
                  src="./HomePageImage/gmail.png"
                  alt="Gmail"
                  onLoad={() =>
                    setIconsLoaded((prev) => ({ ...prev, gmail: true }))
                  }
                />
              </button>
              <button className="social-btn Facebook">
                <img
                  src="./HomePageImage/Facebook.png"
                  alt="Facebook"
                  onLoad={() =>
                    setIconsLoaded((prev) => ({ ...prev, facebook: true }))
                  }
                />
              </button>
              <button className="social-btn Twitter">
                <img
                  src="./HomePageImage/Twitter.png"
                  alt="Twitter"
                  onLoad={() =>
                    setIconsLoaded((prev) => ({ ...prev, twitter: true }))
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
