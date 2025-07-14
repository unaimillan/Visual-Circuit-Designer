import React, { useState, useEffect, useRef } from "react";
import "../../CSS/reg.css";
import "../../CSS/variables.css";
import { Link } from "react-router-dom";

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const Auth = () => {
  // Состояния для полей формы
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Состояния для валидации
  const [emailError, setEmailError] = useState("");
  const [wasEmailFocused, setWasEmailFocused] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [wasUsernameFocused, setWasUsernameFocused] = useState(false);

  const [wasConfirmPasswordFocused, setWasConfirmPasswordFocused] = useState(false);

  // Рефы для элементов
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Валидация email
  const isValidEmail = EMAIL_REGEXP.test(email);

  // Валидация username
  const validateUsername = () => {
    if (username.trim() === "") return "";

    if (username.length < 4 || username.length > 25) {
      return "Username length must be 4-25 characters";
    }

    if (!/^[a-zA-Z0-9._-]*$/.test(username)) {
      return "Username contains invalid character";
    }

    return "";
  };

  // Валидация паролей
  const passwordsMatch = password === confirmPassword;

  // Обработчики изменений полей
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Эффект для валидации и стилизации полей
  useEffect(() => {
    // Валидация username
    if (wasUsernameFocused) {
      const error = validateUsername();
      setUsernameError(error);
      if (usernameRef.current) {
        usernameRef.current.style.borderColor = error ? "red" : "var(--main-5)";
      }
    } else {
      setUsernameError("");
      if (usernameRef.current) {
        usernameRef.current.style.borderColor = "var(--main-5)";
      }
    }

    // Валидация email
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

    // Валидация подтверждения пароля
    if (wasConfirmPasswordFocused) {
      const error = confirmPassword.trim() !== "" && !passwordsMatch
        ? "Passwords do not match"
        : "";
      if (confirmPasswordRef.current) {
        confirmPasswordRef.current.style.borderColor = error ? "red" : "var(--main-5)";
      }
    } else {
      if (confirmPasswordRef.current) {
        confirmPasswordRef.current.style.borderColor = "var(--main-5)";
      }
    }
  }, [
    username,
    wasUsernameFocused,
    email,
    wasEmailFocused,
    isValidEmail,
    password,
    confirmPassword,
    wasConfirmPasswordFocused,
    passwordsMatch,
  ]);

  return (
    <div className="reg-container">
      <div className="reg-window">
        <div className="reg-window-text">Registration</div>
        <div className="input-line-container">
          {/* Поле username */}
          <div className="input-username-text">Username</div>
          <input
            ref={usernameRef}
            className={`input-username-window ${
              wasUsernameFocused && usernameError ? "invalid" : ""
            }`}
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => setWasUsernameFocused(false)}
            onBlur={() => {
              if (username.trim() !== "") {
                setWasUsernameFocused(true);
              } else {
                setWasUsernameFocused(false);
              }
            }}
          />
          {wasUsernameFocused && usernameError && (
            <div className="error-message username-error">
              {usernameError}
            </div>
          )}

          {/* Поле email */}
          <div className="input-email-text">Email</div>
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

          {/* Поля пароля */}
          <div className="input-password-text">Password</div>
          <input
            ref={passwordRef}
            className="input-password-window"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />

          <div className="input-confirm-password-text">Confirm password:</div>
          <input
            ref={confirmPasswordRef}
            className={`input-password-window ${
              wasConfirmPasswordFocused &&
              !passwordsMatch &&
              confirmPassword !== ""
                ? "invalid"
                : ""
            }`}
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onFocus={() => setWasConfirmPasswordFocused(false)}
            onBlur={() => {
              if (confirmPassword.trim() !== "") {
                setWasConfirmPasswordFocused(true);
              } else {
                setWasConfirmPasswordFocused(false);
              }
            }}
          />
          {wasConfirmPasswordFocused && !passwordsMatch && confirmPassword !== "" && (
            <div className="error-message password-error">
              Passwords do not match
            </div>
          )}
        </div>
        <Link
          to="/profile"
          className="reg-button"
          style={{ textDecoration: "none" }}
        >
          <span className="reg-button-text">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default Auth;