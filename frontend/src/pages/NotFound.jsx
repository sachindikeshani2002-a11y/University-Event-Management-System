import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: "12px", textAlign: "center", padding: "24px" }}>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/">Return to your portal</Link>
    </main>
  );
}

export default NotFound;
