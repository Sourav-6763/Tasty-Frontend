import React, { useState, useRef } from "react";
import "./OtpSignup.css";
import axios from "axios";
import { baseUrl } from "../Url";
import { toast, Toaster } from "sonner";

const OtpSignup = ({ otpBoxOpen, setOtpBoxOpen, email,setButtonDisabled }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 4 || otp.includes("")) {
      alert("Please enter all 4 digits of the OTP.");
      return;
    }

   try {
  const res = await axios.post(`${baseUrl}/api/user/verifyOTP`, { email, otp });
  toast.success(res.data.message);
  setButtonDisabled(false);
  setOtpBoxOpen(false);
} catch (error) {
  const message = error.response?.data?.message || "Verification failed";
  toast.error(message);
  console.error("Verification error:", error);
}

  };

  const handleCancel = () => {
    setOtpBoxOpen(false);
  };

  return (
    <div className="otpOverlay">
    <Toaster position="top-right" richColors />
      <div className="otpContainer">
        <form onSubmit={handleSubmit} className="otp-form">
          <h2>Verify OTP</h2>
          <div className="otp-boxes">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <div className="submitCancelContainer">
            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="submit">Verify</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpSignup;
