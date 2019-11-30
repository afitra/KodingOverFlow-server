const Question = require("../models/question"),
    getError = require('../helpers/getError'),
    token2payload = require('../helpers/token2payload');

class QuestionController {
    static create(req, res) {
        let data = { userID: req.userLoggedIn.id }
        Object.assign(req.body, data);
        Question.create(req.body)
            .then(question => {
                res.status(201).json(question);
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
    static read(req, res) {
        if (req.params.id) {
            Question.findOne({ _id: req.params.id }).populate('userID')
                .then(question => {
                    res.status(200).json(question);
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
            Question.find().populate('userID')
                .then(questions => {
                    res.status(200).json(questions);
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
    static update(req, res) {
        if (req.body.voter) {
            let voter = token2payload(req.body.voter);
            let action = req.body.action;
            let upvotes = [];
            let downvotes = [];
            Question.findById({ _id: req.params.id })
                .then(question => {
                    let votes = question[action];
                    if (votes.length > 0) {
                        for (let i = 0; i < votes.length; i++) {
                            if (String(votes[i]) === String(voter.id)) {
                                throw ({ contMessage: `You're already ${action}` });
                            }
                        }
                    }

                    let anotherVotes = [];
                    if (action === "upvotes") anotherVotes = question.downvotes;
                    else anotherVotes = question.upvotes;

                    if (anotherVotes.length > 0) {
                        for (let i = 0; i < anotherVotes.length; i++) {
                            if (String(anotherVotes[i]) === String(voter.id)) {
                                anotherVotes.splice(i, 1);
                                break;
                            }
                        }
                    }
                    votes.push(voter.id);
                    if (action === "upvotes") {
                        upvotes = votes;
                        downvotes = anotherVotes;
                    }
                    else {
                        upvotes = anotherVotes;
                        downvotes = votes;
                    }
                    return Question.findByIdAndUpdate({ _id: req.params.id }, { upvotes, downvotes }, { new: true })
                })
                .then(question => {
                    res.status(200).json(question);
                })
                .catch(err => {
                    if (err.path === 'id') {
                        res.status(404).json({
                            message: `Question not found`
                        });
                    }
                    else if (err.message) {
                        res.status(400).json({
                            message: getError(err)
                        });
                    }
                    else if (err.contMessage) {
                        res.status(400).json({
                            message: err.contMessage
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
            Question.findById({ _id: req.params.id })
                .then(question => {
                    if (question) {
                        Object.assign(question, req.body);
                        return question.save()
                    }
                })
                .then(question => {
                    res.status(200).json(question)
                })
                .catch(err => {
                    if (err.path === 'id') {
                        res.status(404).json({
                            message: `Question not found`
                        });
                    }
                    else if (err.message) {
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
    static delete(req, res) {
        Question.deleteOne({ _id: req.params.id })
            .then(info => {
                res.status(200).json(info)
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
module.exports = QuestionController;