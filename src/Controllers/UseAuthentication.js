import { useState, useEffect } from 'react';
import Authentication from "../modal/Authentication";

export const useAuthentication = () => {
    const [authentication, setAuthentication] = useState(null);
    const [login, setLogin] = useState(() => async () => false);
    const [logout, setLogout] = useState(() => () => {});
    const [isAuthenticated, setIsAuthenticated] = useState(() => () => false);

    const authEndPoint = 'https://used-products-selling-site-backend-api.onrender.com/auth/signin';

    useEffect(() => {
        const loginFunction = async (auth) => {
            try {
                const response = await fetch(authEndPoint, {  
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(auth)  
                });

                if (response.ok) {
                    const data = await response.json();
                    const token = data.token;

                    const authInstance = new Authentication(token);
                    setAuthentication(authInstance);

                    return true;
                }
                return false;
            } catch (error) {
                console.error("Login failed:", error);
                return false;
            }
        };

        const logoutFunction = () => {
            if (authentication) {
                authentication.logout();
                setAuthentication(new Authentication(null));
            }
        };

        const isAuthFunction = () => {
            return authentication ? authentication.isAuthenticated() : false;
        };

        // expose the functions outside the effect
        setLogin(() => loginFunction);
        setLogout(() => logoutFunction);
        setIsAuthenticated(() => isAuthFunction);

        const savedToken = localStorage.getItem("token");
        if (savedToken && !authentication) {
            setAuthentication(new Authentication(savedToken));
        }
    }, [authentication]);

    return {
        login,
        logout,
        isAuthenticated,
        authentication,
    };
};
