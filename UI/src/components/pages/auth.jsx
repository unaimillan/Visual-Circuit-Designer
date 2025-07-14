import React, { useState, useEffect, useCallback } from "react";
import "../../CSS/auth.css";
import "../../CSS/variables.css";
import { Link, useNavigate } from "react-router-dom"; // Добавлен useNavigate

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const Auth = () => {
  const navigate = useNavigate(); // Используем хук

  // Состояния полей формы
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Состояния валидации
  const [emailError, setEmailError] = useState("");
  const [wasEmailFocused, setWasEmailFocused] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [wasPasswordFocused, setWasPasswordFocused] = useState(false);

  // Функции валидации
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
    return "";
  }, [password]);

  // Обработчики изменений
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Эффекты валидации
  useEffect(() => {
    if (wasEmailFocused) {
      setEmailError(validateEmail());
    }
  }, [email, wasEmailFocused, validateEmail]);

  useEffect(() => {
    if (wasPasswordFocused) {
      setPasswordError(validatePassword());
    }
  }, [password, wasPasswordFocused, validatePassword]);

  // Обработчик входа
  const handleLogin = () => {
    // Активируем проверку всех полей
    setWasEmailFocused(true);
    setWasPasswordFocused(true);

    const emailErr = validateEmail();
    const passwordErr = validatePassword();

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (!emailErr && !passwordErr) {
      navigate('/profile');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-window">
        <div className="auth-window-text">Log in</div>
        <div className="input-line-container">
          <div className="input-email-text">Enter email:</div>
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

          <div className="input-password-text">Enter password:</div>
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
            <div className="error-message password-error">
              {passwordError}
            </div>
          )}
        </div>

        <button
          className="log-in-button"
          onClick={handleLogin}
        >
          <span className="log-in-button-text">Log in</span>
        </button>

        <div className="register-text"> Have no account? </div>
        <Link to="/reg" className="register-link">
          <span className="register-link-text">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default Auth;