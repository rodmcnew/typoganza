/**
 *
 * @param {UserManager} userManager
 * @returns {function(*, *)}
 */
export default function (userManager) {
    return (req, res) => {
        let newUserId = req.params.userId;
        if (userManager.getUser(newUserId)) {
            res.status(409).send('Conflict');
            return;
        }

        let authToken = userManager.generateRandomAuthToken();

        userManager.addUser({id: newUserId});
        userManager.addAuthToken(authToken, newUserId);

        res.send({authorization: authToken});
    }
}
