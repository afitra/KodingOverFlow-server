const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const answerSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title must be filled']
    },
    description: {
        type: String,
        required: [true, 'Description must be filled']
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    questionID: {
        type: Schema.Types.ObjectId,
        ref: 'Questions'
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
});

const Answer = mongoose.model("Answers", answerSchema);

module.exports = Answer;