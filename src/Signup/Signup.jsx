import React, { useContext, useEffect, useState } from "react";
import "./Signup.css";
import OtpSignup from "./OtpSignup";
import { BsSend } from "react-icons/bs";
import axios from "axios";
import { baseUrl } from "../Url";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PostList } from "../Store/AllStore";

const Signup = () => {
  const navigate = useNavigate();
  const [otpBoxOpen, setOtpBoxOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [timeToSentOtp, setTimeToSentOtp] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
   const {activeTab, setActiveTab } = useContext(PostList);
  useEffect(() => {
    let intervalId;
    if (timeToSentOtp > 0) {
      intervalId = setInterval(() => {
        setTimeToSentOtp((num) => num - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timeToSentOtp]);
  const sentOtp = async () => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/i;

    if (!email || !gmailRegex.test(email)) {
      toast.error("Please provide a valid Gmail address");
      return;
    }
    try {
      if (timeToSentOtp != 0) {
        toast.error(`wait ${timeToSentOtp} seconds`);
        return;
      }
      setOtpBoxOpen(!otpBoxOpen);
      setTimeToSentOtp(10);
      const response = await axios.post(`${baseUrl}/api/user/sentOTP`, {
        email,
      });
      if (response.status === 200) {
        toast.success("OTP sent to your Gmail");
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      toast.error("Failed to send OTP");
    }
  };

  const signupFromSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/user/signup`, {
        email,
        password,
        name: userName,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/login"); // Use navigate here
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Unexpected error occurred. Please try again later.");
      }
    }
  };

  const signinHandeler = () => {
    setActiveTab("signin");
    navigate("/login");
  };
  const signunHandeler = () => {
    setActiveTab("signup");
    navigate("/signup");
  };

  return (
    <div className={`loginContainer ${otpBoxOpen ? "blur-background" : ""}`}>
      <Toaster position="top-right" richColors />
      {otpBoxOpen && (
        <OtpSignup
          otpBoxOpen={otpBoxOpen}
          setOtpBoxOpen={setOtpBoxOpen}
          email={email}
          setButtonDisabled={setButtonDisabled}
        />
      )}

     <img
        className="loginBackgroundImageForSmallScreen"
        src="./HomePageImage/loginpagebackground.png"
        alt="Login"
      />
      <div className="login-card">
        <div className="signInAndSignupContainer">
          <div
            className={`tab ${activeTab === "signin" ? "active" : ""}`}
            onClick={() => signinHandeler()}
          >
            Signin
          </div>
          <div
            className={`tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => signunHandeler()}
          >
            Signup
          </div>
          <div className={`underline ${activeTab}`} />
        </div>
        <p className="loginPara">
          More than <span className="highlight">3,500</span> recipes from around
          the world!
        </p>

        <form className="loginFrom" onSubmit={signupFromSubmit}>
          <div className="phonNumberField">
            <label htmlFor="">Enter Email</label>
            <div className="verificationContainer">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="input-field"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="verification" onClick={() => sentOtp()}>
                <BsSend />
              </div>
            </div>
          </div>
          <div className="nameField">
            <label htmlFor="">UserName</label>
            <input
              placeholder="UserName"
              className="input-field"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="passwordField">
            <label htmlFor="">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              disabled={buttonDisabled}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-btn">Signup</button>
        </form>

        {/* Social Logins */}
        <div className="social-login">
          <p>Or Login with</p>
          <div className="social-login-container">
            <button className="social-btn  gmail">
              <img src="./HomePageImage/gmail.png" alt="" srcSet="" />
            </button>
            <button className="social-btn  gmail">
              <img src="./HomePageImage/Facebook.png" alt="" srcSet="" />
            </button>
            <button className="social-btn  gmail">
              <img src="./HomePageImage/Twitter.png" alt="" srcSet="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
