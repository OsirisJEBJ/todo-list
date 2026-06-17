import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div style={{ padding: "1rem", maxWidth: "700px" }}>
      <h1>404 – Page Not Found</h1>

      <p>
        The page you’re looking for doesn’t exist or may have been moved.
        You can use the links below to get back to the main parts of the app.
      </p>

      <ul>
        <li>
          <Link to="/login">Go to Login</Link>
        </li>
        <li>
          <Link to="/todos">View Your Todos</Link>
        </li>
        <li>
          <Link to="/about">About This App</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </div>
  );
}

export default NotFoundPage;
