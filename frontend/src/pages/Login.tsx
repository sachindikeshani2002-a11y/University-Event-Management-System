import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Users,
} from "lucide-react";
import "./Login.css";

type UserRole = "student" | "organizer" | "admin";

type LoginProps = {
  onLoginSuccess: (role: UserRole) => void;
};

function getMockRoleFromEmail(email: string): UserRole {
  const username = email.trim().split("@")[0]?.toLowerCase();
  if (username === "admin") return "admin";
  if (username === "organizer") return "organizer";
  return "student";
}

function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mockRole = getMockRoleFromEmail(email);
    onLoginSuccess(mockRole);

    const routeMap: Record<UserRole, string> = {
      student: "/",
      organizer: "/organizer",
      admin: "/admin",
    };

    navigate(routeMap[mockRole], { replace: true });
  };

  const handleForgotPassword = () => {
    window.alert("Password reset functionality will be available after backend authentication is implemented.");
  };

  const handleUniversityLogin = () => {
    window.alert("University account authentication will be available after backend integration.");
  };

  const handleRegister = () => {
    window.alert("Registration will be implemented later.");
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
          <div className="feature">
            <div className="icon-box">
              <CalendarDays />
            </div>
            <div className="feature-copy">
              <h3>Discover</h3>
              <p>Exciting Events</p>
            </div>
          </div>

          <div className="feature">
            <div className="icon-box">
              <Users />
            </div>
            <div className="feature-copy">
              <h3>Participate</h3>
              <p>in Activities</p>
            </div>
          </div>

          <div className="feature">
            <div className="icon-box">
              <BarChart3 />
            </div>
            <div className="feature-copy">
              <h3>Grow</h3>
              <p>Your Skills</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-box">
            <Mail />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              aria-label="Email"
            />
          </label>

          <div className="input-box password-box">
            <Lock />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              aria-label="Password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="options">
            <label className="remember-wrap">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button type="button" className="text-link" onClick={handleForgotPassword}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="login-btn">
            Login →
          </button>

          <div className="or">OR</div>

          <button type="button" className="uni-btn" onClick={handleUniversityLogin}>
            🎓 Continue with University Account
          </button>

          <p className="register">
            Don&apos;t have an account?
            <button type="button" className="register-link" onClick={handleRegister}>
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
