import { useState } from "react";
import { Navigate } from "react-router-dom";
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).{8,}$/;

const initialState = {
  name: "",
  email: "",
  password: "",
};

const AuthPage = () => {
  const { login, loading, signup, token } = useAuth();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState(initialState);
  const [feedback, setFeedback] = useState("");

  const validateForm = () => {
    const normalizedEmail = formData.email.trim().toLowerCase();

    if (mode === "signup" && !formData.name.trim()) {
      return "Full name is required";
    }

    if (!gmailRegex.test(normalizedEmail)) {
      return "Please use a valid @gmail.com email address";
    }

    if (!strongPasswordRegex.test(formData.password)) {
      return "Password must be 8+ characters with uppercase, lowercase, number, and special character";
    }

    return "";
  };

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");

    const validationMessage = validateForm();

    if (validationMessage) {
      setFeedback(validationMessage);
      return;
    }

    const action = mode === "login" ? login : signup;
    const payload =
      mode === "login"
        ? { email: formData.email.trim().toLowerCase(), password: formData.password }
        : {
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
        };
    const response = await action(payload);

    if (!response.ok) {
      setFeedback(response.message);
    }
  };

  return (
    <div className="auth-shell">
      <section className="hero-panel">
        <div className="hero-glow"></div>

        <span className="eyebrow">
          <span className="dot"></span>
          Smart Personal Finance Manager
        </span>

        <h1>
          Turn daily money decisions into
          <span> clear financial momentum.</span>
        </h1>

        <p>
          WealthWave gives students, professionals, and first-time planners a
          simple way to track spending, control budgets, and understand financial
          habits through beautiful real-time insights.
        </p>

        <div className="hero-points">
          <div className="point-card">
            <div className="icon">💰</div>
            <span>Track income & expenses</span>
          </div>

          <div className="point-card">
            <div className="icon">📊</div>
            <span>Set smart monthly budgets</span>
          </div>

          <div className="point-card">
            <div className="icon">⚡</div>
            <span>Instant visual reports</span>
          </div>
        </div>


      </section>

      <section className="auth-panel">
          <div class="logo">
            <img src={logo} alt="Logo" />
          </div>
        <div className="auth-switch">
          <div className={`slider ${mode}`} />

          <button onClick={() => setMode("login")} type="button">
            Login
          </button>

          <button onClick={() => setMode("signup")} type="button">
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="fullname">
              Full Name
              <input name="name" value={formData.name} onChange={handleChange} required />
            </label>
          )}

          <label className="flex flex-col gap-2 text-sm font-medium text-black">

            <div className="flex items-center gap-4 text-base">
              <FaEnvelope className="email" />
              <span> Email</span>
            </div>


            <input
              name="email"
              type="email"
              placeholder="yourname@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="flex flex-col gap-5 text-sm font-medium text-black">
            <div className="flex items-center gap-4 text-base">
              <FaLock className="password" />
              <span> Password</span>
            </div>

            <input
              minLength={8}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <small className="password-below">
              Use at least 8 characters with uppercase, lowercase, number, and special character.
            </small>
          </label>



          {feedback ? <p className="error-text">{feedback}</p> : null}

          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "login" ? "Login to WealthWave" : "Create account"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AuthPage;
