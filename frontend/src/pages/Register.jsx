import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, CalendarDays, Eye, EyeOff, Lock, Mail, UserRound, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      setMessage("Please complete all fields.");
      return;
    }
    if (!emailPattern.test(normalizedEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setMessage("Password cannot contain only whitespace.");
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setMessage("Password must not exceed 72 bytes.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);
    try {
      await register({ name: normalizedName, email: normalizedEmail, password });
      navigate("/login", {
        replace: true,
        state: { registrationSuccess: "Your student account was created. You can now log in." },
      });
    } catch (error) {
      setMessage(error.message || "Unable to create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="left-section">
        <h1>
          <span className="brand-line">University</span>
          <span className="brand-line brand-highlight">Event</span>
          <span className="brand-line brand-highlight">Management</span>
          <span className="brand-line">System</span>
        </h1>
        <div className="yellow-line" />
        <div className="feature-list">
          <div className="feature"><div className="icon-box"><CalendarDays /></div><div className="feature-copy"><h3>Discover</h3><p>Exciting Events</p></div></div>
          <div className="feature"><div className="icon-box"><Users /></div><div className="feature-copy"><h3>Participate</h3><p>in Activities</p></div></div>
          <div className="feature"><div className="icon-box"><BarChart3 /></div><div className="feature-copy"><h3>Grow</h3><p>Your Skills</p></div></div>
        </div>
      </div>

      <section className="login-card register-card" aria-labelledby="register-heading">
        <h2 id="register-heading">Create Account</h2>
        <p>Register as a student</p>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {message && <p className="login-validation" role="alert">{message}</p>}
          <label className="input-box">
            <UserRound aria-hidden="true" />
            <input type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" aria-label="Full name" required />
          </label>
          <label className="input-box">
            <Mail aria-hidden="true" />
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" aria-label="Email address" required />
          </label>
          <div className="input-box password-box">
            <Lock aria-hidden="true" />
            <input type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" aria-label="Password" required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <label className="input-box">
            <Lock aria-hidden="true" />
            <input type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" aria-label="Confirm password" required />
          </label>
          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
          <p className="register">Already have an account?
            <button type="button" className="register-link" onClick={() => navigate("/login")}>Log in</button>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;
