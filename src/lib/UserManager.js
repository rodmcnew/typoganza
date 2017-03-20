export default class UserManager {
    constructor() {
        this.users = [];
        this.authTokens = {};
        this.addUser = this.addUser.bind(this);
    }

    /**
     * @TODO add expirationDate
     * @param {string} authToken
     * @param {string} userId
     */
    addAuthToken(authToken, userId) {
        this.authTokens[authToken] = {userId: userId};
    }

    /**
     * @TODO check for duplicates
     * @param {object} user
     */
    addUser(user) {
        if (!user.id) {
            throw new Error('User must have id');
        }
        if (this.getUser(user.id)) {
            throw new Error('User already exists: ' + user.id);
        }
        this.users.push(user);
    }

    /**
     *
     * @param {object} authTokens
     */
    setAuthTokens(authTokens) {
        this.authTokens = authTokens;
    }

    /**
     *
     * @param {string} userId
     * @returns {object|null}
     */
    getUser(userId) {
        return this.users.find((user) => user.id === userId);
    }

    /**
     *
     * @returns {Array}
     */
    getUsers() {
        return this.users;
    }

    /**
     *
     * @returns {{}}
     */
    getAuthTokens() {
        return this.authTokens;
    }

    /**
     *
     * @param {Array} users
     */
    setUsers(users) {
        this.users = users;
    }

    /**
     *
     * @returns {function(*, *, *)}
     */
    getMiddleware() {
        return (req, res, next) => {
            let authorization = req.query.authorization;
            if (!authorization) {
                next();
                return;
            }
            if (!this.authTokens[authorization]) {
                res.status(401).send('Unauthorized');
                return;
            }
            let userId = this.authTokens[authorization].userId;
            let user = this.users.find((user) => userId === user.id);
            if (!user) {
                res.status(401).send('Unauthorized');
                return;
            }
            req.authToken = authorization;
            req.user = user;
            next();
        }
    }

    generateRandomAuthToken() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 64; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
}
