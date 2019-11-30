const User = require("../models/user"),
    jwt = require('jsonwebtoken'),
    bcrypt = require('../helpers/bcrypt'),
    getError = require('../helpers/getError'),
    { OAuth2Client } = require('google-auth-library'),
    client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


class UserController {
    static register(req, res) {
        Object.assign(req.body, { username: req.body.email.split('@')[0] })
        User.create(req.body)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                if (err.message) {
                    res.status(400).json({
                        message: getError(err)
                    });
                }
                else {
                    res.status(500).json({
                        message: `Internal Server Error`
                    });
                }
            })
    }
    static login(req, res) {
        if (req.headers.id_token) {
            // L O G I N   B Y   G O O G L E
            let googleUser = '';
            client.verifyIdToken({
                idToken: req.headers.id_token,
                audience: process.env.GOOGLE_CLIENT_ID
            })
                .then(({ payload }) => {
                    googleUser = payload;
                    return User.findOne({ email: payload.email })
                })
                .then(user => {
                    if (user) return user;
                    else {
                        return User.create({
                            username: googleUser.email.split('@')[0],
                            email: googleUser.email,
                            password: process.env.DEFAULT_GOOGLE_PASSWORD,
                            by: 'google'
                        })
                    }
                })
                .then(user => {
                    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
                    res.status(200).json({ token, username: user.username });
                })
                .catch(err => {
                    if (err.message) {
                        res.status(400).json({
                            message: getError(err)
                        });
                    }
                    else {
                        res.status(500).json({
                            message: `Internal Server Error`
                        });
                    }
                })
        }
        else {
            // L O G I N   M A N U A L
            const { email, password } = req.body;
            User.findOne({ email, by: 'manual' })
                .then(user => {
                    if (user) {
                        if (bcrypt.compare(password, user.password)) {
                            let { _id, username } = user
                            let token = jwt.sign({ id: _id }, process.env.JWT_SECRET)
                            res.status(200).json({ token, username });
                        }
                        else {
                            res.status(400).json({
                                message: `Email / Password Wrong`
                            })
                        }
                    }
                    else {
                        res.status(400).json({
                            message: `Email / Password Wrong`
                        })
                    }
                })
                .catch(err => {
                    if (err.message) {
                        res.status(400).json({
                            message: getError(err)
                        });
                    }
                    else {
                        res.status(500).json({
                            message: `Internal Server Error`
                        });
                    }
                })
        }
    }

    static update(req, res) { }
}
module.exports = UserController;