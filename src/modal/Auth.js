class Auth {
    constructor(email = null,password=null, username = null ) {
        this.email = email;
        this.password = password;
        this.username = username;
    
    }
    static fromJSON(json) {
        if (!json) {
            return null;
        }
        return new Auth(
            json.email,
            json.password,
            json.username
        );
    }

    toJSON() {
        return {
            email: this.email,
            password: this.password,
            username: this.username
        };
    }

}