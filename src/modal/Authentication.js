class Authentication {
    constructor(token = null) {
        this.token = token;
        this.decodeToken();
        this.handleIsAuthenticated();
    }

    decodeToken() {
        if (!this.token) {
            return null;
        }
        try {
            
            console.log("Decoding token:", this.token);
            const payload = this.token.split('.')[1];
            const decodedPayload = atob(payload);
            const payloadObject = JSON.parse(decodedPayload);

            // Store user id and username in local storage
            localStorage.setItem('userId', payloadObject.id);
            localStorage.setItem('username', payloadObject.username);
            // Store the token in local storage
            localStorage.setItem('token', this.token);
            return payloadObject;
        } catch (error) {
            this.logout();
            console.error("Error decoding token:", error);
            return null;
        }
    }

    handleIsAuthenticated() {
        if (this.token) {
            localStorage.setItem('isAuthenticated', 'true');
        } else {
            localStorage.setItem('isAuthenticated', 'false');
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.setItem('isAuthenticated', 'false');
    }
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }   
}

export default Authentication;