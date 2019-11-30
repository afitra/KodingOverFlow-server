const Answer = require("../models/answer"),
    getError = require('../helpers/getError'),
    token2payload = require('../helpers/token2payload'),
    mailer = require('../helpers/nodeMailer'),
    Question = require("../models/question");

class AnswerController {
    static create(req, res) {
        let userID = req.userLoggedIn.id;
        let newAnswer = null;
        Answer.create({ ...req.body, userID })
            .then(answer => {
                newAnswer = answer;
                return Question.update(
                    { _id: req.body.questionID },
                    { $push: { answerID: answer._id } },
                )
            })
            .then(question => {
                res.status(200).json(newAnswer);
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
        Answer.find({ questionID: req.params.questionID }).populate('userID')
            .then(answers => {
                res.status(200).json(answers)
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
    static update(req, res) {
        if (req.body.voter) {
            let voter = token2payload(req.body.voter);
            let action = req.body.action;
            let upvotes = [];
            let downvotes = [];
            Answer.findById({ _id: req.params.id })
                .then(answer => {
                    let votes = answer[action];
                    if (votes.length > 0) {
                        for (let i = 0; i < votes.length; i++) {
                            if (String(votes[i]) === String(voter.id)) {
                                throw ({ contMessage: `You're already ${action}` });
                            }
                        }
                    }

                    let anotherVotes = [];
                    if (action === "upvotes") anotherVotes = answer.downvotes;
                    else anotherVotes = answer.upvotes;

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
                    return Answer.findByIdAndUpdate({ _id: req.params.id }, { upvotes, downvotes }, { new: true })
                })
                .then(answer => {
                    res.status(200).json(answer);
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
            console.log("masuk");
            Answer.findById({ _id: req.params.id })
                .then(question => {
                    console.log(question);
                    console.log(question.userID);
                    console.log(req.userLoggedIn.id);
                    if (question && String(question.userID) === String(req.userLoggedIn.id)) {
                        Object.assign(question, req.body);
                        return question.save()
                    }
                    else throw ({ contMessage: `You can't edit this answer` })
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
    }
    // static update(req, res) {
    //     Answer.findOne({ _id: req.params.id })
    //         .then(answer => {
    //             if (answer) {
    //                 Object.assign(answer, req.body)
    //                 return answer.save();
    //             }
    //         })
    //         .then(answer => {
    //             res.status(200).json(answer)
    //         })
    //         .catch(err => {
    //             if (err.path === 'id') {
    //                 res.status(404).json({
    //                     message: `Answer not found`
    //                 });
    //             }
    //             else if (err.message) {
    //                 res.status(400).json({
    //                     message: getError(err)
    //                 });
    //             }
    //             else {
    //                 res.status(500).json({
    //                     message: `Internal Server Error`
    //                 });
    //             }
    //         })
    // }
    static delete(req, res) {
        Answer.findOneAndDelete({ _id: req.params.id })
            .then(answer => {
                console.log(answer);
                return Question.update(
                    { _id: req.body.questionID },
                    { $pull: { answerID: answer._id } },
                )
            })
            .then(answer => {
                console.log("----------");
                console.log(answer);
                res.status(200).json(answer)
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
module.exports = AnswerController;