import React, { useState, useEffect, useCallback } from "react";
import "../../CSS/reg.css";
import "../../CSS/variables.css";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const Auth = () => {
  const navigate = useNavigate();

  // Состояния полей формы
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Состояния валидации
  const [emailError, setEmailError] = useState("");
  const [wasEmailFocused, setWasEmailFocused] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [wasUsernameFocused, setWasUsernameFocused] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [wasPasswordFocused, setWasPasswordFocused] = useState(false);

  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [wasConfirmPasswordFocused, setWasConfirmPasswordFocused] = useState(false);

  // Функции валидации
  const validateUsername = useCallback(() => {
    if (username.trim() === "") {
      return "Username is required";
    }
    if (username.length < 4 || username.length > 25) {
      return "Username length must be 4-25 characters";
    }
    if (!/^[a-zA-Z0-9._-]*$/.test(username)) {
      return "Username contains invalid character";
    }
    return "";
  }, [username]);

  const validateEmail = useCallback(() => {
    if (email.trim() === "") {
      return "Email is required";
    }
    if (!EMAIL_REGEXP.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  }, [email]);

  const validatePassword = useCallback(() => {
    if (password.trim() === "") {
      return "Password is required";
    }
    if (password.length < 8 || password.length > 16) {
      return "Password must be 8-16 characters";
    }
    if (!/^[a-zA-Z0-9]*$/.test(password)) {
      return "Password can only contain Latin letters and numbers";
    }
    return "";
  }, [password]);

  const validateConfirmPassword = useCallback(() => {
    if (confirmPassword.trim() === "") {
      return "Confirm password is required";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  }, [confirmPassword, password]);

  // Обработчики изменений
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // Эффект валидации
  useEffect(() => {
    if (wasUsernameFocused) {
      setUsernameError(validateUsername());
    }

    if (wasEmailFocused) {
      setEmailError(validateEmail());
    }

    if (wasPasswordFocused) {
      setPasswordError(validatePassword());
    }

    if (wasConfirmPasswordFocused) {
      setConfirmPasswordError(validateConfirmPassword());
    }
  }, [
    username,
    wasUsernameFocused,
    email,
    wasEmailFocused,
    password,
    wasPasswordFocused,
    confirmPassword,
    wasConfirmPasswordFocused,
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirmPassword
  ]);

  // Обработчик регистрации
  const handleRegister = () => {
    setWasUsernameFocused(true);
    setWasEmailFocused(true);
    setWasPasswordFocused(true);
    setWasConfirmPasswordFocused(true);

    const errors = {
      username: validateUsername(),
      email: validateEmail(),
      password: validatePassword(),
      confirmPassword: validateConfirmPassword(),
    };

    setUsernameError(errors.username);
    setEmailError(errors.email);
    setPasswordError(errors.password);
    setConfirmPasswordError(errors.confirmPassword);

    const hasErrors = Object.values(errors).some(error => error !== "");
    if (!hasErrors) {
      navigate('/profile');
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-window">
        <div className="reg-window-text">Registration</div>
        <div className="input-line-container">
          {/* Поле username */}
          <div className="input-username-text">Username</div>
          <input
            className={`input-username-window ${
              wasUsernameFocused && usernameError ? "invalid" : ""
            }`}
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => setWasUsernameFocused(false)}
            onBlur={() => {
              if (username.trim() !== "") {
                setWasUsernameFocused(true);
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
            className={`input-email-window ${
              wasEmailFocused && emailError ? "invalid" : ""
            }`}
            value={email}
            onChange={handleEmailChange}
            onFocus={() => setWasEmailFocused(false)}
            onBlur={() => {
              if (email.trim() !== "") {
                setWasEmailFocused(true);
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
            className={`input-password-window ${
              wasPasswordFocused && passwordError ? "invalid" : ""
            }`}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={() => setWasPasswordFocused(false)}
            onBlur={() => {
              if (password.trim() !== "") {
                setWasPasswordFocused(true);
              }
            }}
          />
          {wasPasswordFocused && passwordError && (
            <div className="error-message password-main-error">
              {passwordError}
            </div>
          )}

          <div className="input-confirm-password-text">Confirm password:</div>
          <input
            className={`input-password-window ${
              wasConfirmPasswordFocused && confirmPasswordError ? "invalid" : ""
            }`}
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onFocus={() => setWasConfirmPasswordFocused(false)}
            onBlur={() => {
              if (confirmPassword.trim() !== "") {
                setWasConfirmPasswordFocused(true);
              }
            }}
          />
          {wasConfirmPasswordFocused && confirmPasswordError && (
            <div className="error-message password-error">
              {confirmPasswordError}
            </div>
          )}
        </div>

        <button
          className="reg-button"
          onClick={handleRegister}
        >
          <span className="reg-button-text">Register</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;