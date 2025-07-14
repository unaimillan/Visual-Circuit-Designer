import React, { useState, useEffect, useRef } from "react";
import "../../CSS/auth.css";
import "../../CSS/variables.css";
import { Link } from "react-router-dom";

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const [wasEmailFocused, setWasEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState("");


  const isValidEmail = EMAIL_REGEXP.test(email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (wasEmailFocused) {
      const error = email.trim() !== "" && !isValidEmail
        ? "Please enter a valid email address"
        : "";
      setEmailError(error);
      if (emailRef.current) {
        emailRef.current.style.borderColor = error ? "red" : "var(--main-5)";
      }
    } else {
      setEmailError("");
      if (emailRef.current) {
        emailRef.current.style.borderColor = "var(--main-5)";
      }
    }
  }, [isValidEmail, wasEmailFocused, email]);

  return (
    <div className="auth-container">
      <div className="auth-window">
        <div className="auth-window-text">Log in</div>
        <div className="input-line-container">
          <div className="input-email-text">Enter email:</div>
          <input
            ref={emailRef}
            className={`input-email-window ${
              wasEmailFocused && emailError ? "invalid" : ""
            }`}
            value={email}
            onChange={handleEmailChange}
            onFocus={() => setWasEmailFocused(false)}
            onBlur={() => {
              if (email.trim() !== "") {
                setWasEmailFocused(true);
              } else {
                setWasEmailFocused(false);
              }
            }}
            placeholder="myEmail@example.com"
          />
          {wasEmailFocused && emailError && (
            <div className="error-message email-error">
              {emailError}
            </div>
          )}

          <div className="input-password-text">Enter password:</div>
          <input
            className="input-password-window"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <Link
          to="/profile"
          className="log-in-button"
          style={{ textDecoration: "none" }}
        >
          <span className="log-in-button-text">Log in</span>
        </Link>
        <div className="register-text"> Have no account? </div>
        <Link to="/reg" className="register-link">
          <span className="register-link-text">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default Auth;
