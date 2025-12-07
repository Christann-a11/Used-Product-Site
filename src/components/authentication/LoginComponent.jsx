// LoginComponent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../Controllers/UseAuthentication";
import { API_BASE } from "../../config";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuthentication();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Call backend login
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if(!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      //Pass real token to the hook
      login(data.token, data.user.id);

      // Success
      navigate("/admin");
    } catch (err) {
      setErrorMsg("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="col-md-4">
        <div className="card shadow page-card">
          <div className="card-header text-center">
            <h3 className="mb-0">Login</h3>
          </div>

          <div className="card-body">
            {errorMsg && (
              <div className="alert alert-danger">{errorMsg}</div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn market-btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
