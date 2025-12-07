class Users {
    static modelName = 'users';

    constructor(firstName="", lastName="", email="", username="", password = null, id = null, admin = false) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
        this.admin = admin;
        this.modelName = Users.modelName;
    }

    getProfile() {
        return {
            id: this.id,
            name: `${this.firstName} ${this.lastName}`,
            email: this.email
        };
    }

    static fromJSON(json) {
        if (!json) {
            return null;
        }
        return new Users(
            json.firstName,
            json.lastName,
            json.email,
            json.username,
            null, // password is not deserialized for security
            json.id,
            json.admin
        );
    }

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            username: this.username,
            password: this.password,
            admin: this.admin
             
        };
    }
}

export default Users;
