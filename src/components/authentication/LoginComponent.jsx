// LoginComponent.jsx
import React, { useState } from 'react';
import Authentication from '../../modal/Authentication';
import { useAuthentication } from '../../Controllers/UseAuthentication';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, loading } = useAuthentication();

    const handleLogin = async () => {
        const authData = { email, password };
        const success = await login(authData);        
        if (success) {
            alert('Login successful!');
            // Optionally redirect user
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="col-md-4">
                <div className="card shadow">
                    <div className="card-header text-center">
                        <h3 className="mb-0">Login</h3>
                    </div>

                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error.message}
                            </div>
                        )}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="login-email" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="login-email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="login-password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="login-password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={!loading ? handleLogin : null}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
