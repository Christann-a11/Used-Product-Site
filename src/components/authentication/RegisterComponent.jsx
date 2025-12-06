import React, { useState } from 'react';
import Users from '../../modal/Users';
import useCreateModalData from '../../Controllers/useCreateModalData';

const RegisterComponent = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [clientError, setClientError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const { create, loading, error } = useCreateModalData(new Users());

    const handleRegister = async () => {
        try {
            setClientError(null);
            setSuccessMessage('');

            const trimmedFirstName = firstName.trim();
            const trimmedLastName = lastName.trim();
            const trimmedEmail = email.trim();
            const trimmedUsername = username.trim();
            const trimmedPassword = password.trim();

            if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedUsername || !trimmedPassword) {
                setClientError('All fields are required.');
                return;
            }

            if (trimmedPassword.length < 6) {
                setClientError('Password must be at least 6 characters.');
                return;
            }

            const newUser = new Users(
                trimmedFirstName,
                trimmedLastName,
                trimmedEmail,
                trimmedUsername,
                trimmedPassword
            );
            await create(newUser);

            setSuccessMessage('Registration successful!');
            setFirstName('');
            setLastName('');
            setEmail('');
            setUsername('');
            setPassword('');
        } catch (err) {
            // Error is already handled by the hook and displayed in the component
            console.error("Registration failed in component:", err);
        }
    };

    return (
        <div className=" d-flex justify-content-center align-items-center mt-5">
            <div className="col-md-4">
                <div className="card shadow-lg" >
                    <div className="card-header text-center">
                        <h3 className="mb-0">Register</h3>
                    </div>

                    <div className="card-body">
                        <form>
                            {(clientError || error) && (
                                <div className="alert alert-danger" role="alert">
                                    {clientError || error.message}
                                </div>
                            )}
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter first name"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter last name"
                                />
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={!loading ? handleRegister : null}
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
